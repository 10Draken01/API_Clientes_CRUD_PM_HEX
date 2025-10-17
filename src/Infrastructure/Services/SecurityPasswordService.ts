    import { InvalidPasswordException } from "@/src/Domain/Exceptions/Users/InvalidPasswordException";
    import { SecurityPasswordRepository } from "@/src/Domain/Repository/SecurityPasswordRepository";
    import { PasswordVO } from "@/src/Domain/ValueObjects/PasswordVO";

    class TrieNode {
        children: Map<string, TrieNode> = new Map();
        isEndOfWord: boolean = false;
    }

    interface VulnerabilityCheck {
        hasPartialMatch: boolean;
        hasCompleteMatch: boolean;
        partialMatches: string[];
        completeMatches: string[];
    }

    class PasswordTrie {
        private root: TrieNode = new TrieNode();
        private patterns: Set<string> = new Set();

        constructor(vulnerablePasswords: string[]) {
            vulnerablePasswords
                .filter(p => p && p.length >= 4)
                .forEach(password => {
                    const lower = password.toLowerCase();
                    this.insert(lower);
                    this.patterns.add(lower);
                });
        }

        private insert(word: string): void {
            let node = this.root;
            for (const char of word) {
                if (!node.children.has(char)) {
                    node.children.set(char, new TrieNode());
                }
                node = node.children.get(char)!;
            }
            node.isEndOfWord = true;
        }

        checkVulnerability(text: string, minLength: number = 4): VulnerabilityCheck {
            const textLower = text.toLowerCase();
            const partialMatches = new Set<string>();
            const completeMatches = new Set<string>();
            
            for (let i = 0; i < textLower.length; i++) {
                const matches = this.searchFromPosition(textLower, i, minLength);
                matches.forEach(match => partialMatches.add(match));
            }

            this.patterns.forEach(pattern => {
                if (textLower === pattern) {
                    completeMatches.add(pattern);
                }
            });

            return {
                hasPartialMatch: partialMatches.size > 0,
                hasCompleteMatch: completeMatches.size > 0,
                partialMatches: Array.from(partialMatches),
                completeMatches: Array.from(completeMatches)
            };
        }

        private searchFromPosition(text: string, start: number, minLength: number): string[] {
            let node = this.root;
            let matchLength = 0;
            let currentMatch = "";
            const matches: string[] = [];

            for (let i = start; i < text.length; i++) {
                const char = text[i];
                if (!node.children.has(char)) {
                    break;
                }
                node = node.children.get(char)!;
                matchLength++;
                currentMatch += char;

                if (node.isEndOfWord && matchLength >= minLength) {
                    matches.push(currentMatch);
                }
            }
            return matches;
        }
    }

    export class SecurityPasswordService implements SecurityPasswordRepository {
        private passwordTrie: PasswordTrie;
        private readonly minPatternLength: number = 4;

        constructor(private readonly vulneablePasswords: string[]) {
            this.passwordTrie = new PasswordTrie(vulneablePasswords);
        }

        evaluatePassword(password: string): PasswordVO {
            const causes: string[] = [];

            if (!password || password.trim().length < 8) {
                throw new InvalidPasswordException("Password must have at least 8 characters");
            }
            if (password.length > 128) {
                throw new InvalidPasswordException("Password must not exceed 128 characters");
            }

            const vulnerability = this.passwordTrie.checkVulnerability(password, this.minPatternLength);
            
            if (vulnerability.hasCompleteMatch) {
                throw new InvalidPasswordException(
                    `Password is too common or has been compromised. Found: ${vulnerability.completeMatches.join(", ")}`
                );
            }

            const L = this._calculateLength(password);
            const N = this._calculateWordSpaceSize(password);
            
            const charTypes: string[] = [];
            if (/[a-z]/.test(password)) charTypes.push("lowercase");
            if (/[A-Z]/.test(password)) charTypes.push("uppercase");
            if (/[0-9]/.test(password)) charTypes.push("numbers");
            if (/[!@#$%^&*()_+\-=\[\]{};:'",.<>?/\\|`~\s]/.test(password)) charTypes.push("symbols");
            
            if (charTypes.length > 0) {
                causes.push(`[ ||| Uses ${charTypes.join(", ")} with space of ${N} possible characters ||| ]`);
            }

            let H = 0;
            if (L !== 0 && N >= 2) {
                H = L * Math.log2(N);
            }
            causes.push(`[ ||| Length of ${L} characters generates ${H.toFixed(2)} bits of base entropy ||| ]`);

            let entropyPenalty = 0;
            if (vulnerability.hasPartialMatch) {
                entropyPenalty = vulnerability.partialMatches.length * (H * 0.15);
                H = Math.max(0, H - entropyPenalty);
                
                causes.push(
                    `[ ||| Penalty: Contains vulnerable patterns (${vulnerability.partialMatches.join(", ")}). Reduction of ${entropyPenalty.toFixed(2)} bits (${(vulnerability.partialMatches.length * 15)}%) ||| ]`
                );
            }

            const strength = this._assessStrength(H);
            const crackTime = this._estimateCrackTime(H);

            causes.push(`[ ||| Classification: ${strength} with ${H.toFixed(2)} bits of final entropy ||| ]`);

            if (H < 60) {
                causes.push("[ ||| Recommendation: Increase length and use more character types ||| ]");
            }
            if (vulnerability.hasPartialMatch) {
                causes.push("[ ||| Recommendation: Avoid common words or known patterns ||| ]");
            }
            if (L < 12) {
                causes.push("[ ||| Recommendation: Use at least 12 characters for better security ||| ]");
            }
            if (charTypes.length < 3) {
                causes.push("[ ||| Recommendation: Combine uppercase, lowercase, numbers and symbols ||| ]");
            }

            return new PasswordVO(password, H, L, N, strength, crackTime, causes);
        }

        private _calculateLength(password: string): number {
            return password.length;
        }

        private _calculateWordSpaceSize(password: string): number {
            const characterSet = {
                lowercase: /[a-z]/.test(password),
                uppercase: /[A-Z]/.test(password),
                digits: /[0-9]/.test(password),
                symbols: /[!@#$%^&*()_+\-=\[\]{};:'",.<>?/\\|`~\s]/.test(password),
            };

            let N = 0;
            if (characterSet.lowercase) N += 26;
            if (characterSet.uppercase) N += 26;
            if (characterSet.digits) N += 10;
            if (characterSet.symbols) N += 33;
            
            return N;
        }

        private _assessStrength(entropy: number): string {
            if (entropy < 60) {
                return "Weak";
            } else if (entropy < 128) {
                return "Acceptable";
            } else if (entropy < 192) {
                return "Strong";
            } else {
                return "Very strong";
            }
        }

        private _estimateCrackTime(
            entropy: number, 
            attemptsPerSecond = 1011
        ): { seconds: number; minutes: number; hours: number; days: number; years: number } {
            const combinations = Math.pow(2, entropy);
            const seconds = combinations / (2 * attemptsPerSecond);

            return {
                seconds: seconds,
                minutes: seconds / 60,
                hours: seconds / 3600,
                days: seconds / 86400,
                years: seconds / (365.25 * 86400)
            };
        }
    }