# Improved Security Checklist

This checklist is designed to be more actionable and easier to track. It includes priorities for each check and suggestions for tooling where applicable.

## Attacker's Mindset

### Denial-Of-Service (DOS) Attack

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Is the withdrawal pattern followed to prevent denial of service?   |    P1    | Review withdrawal functions for patterns like "pull-over-push". Manually review code.                                                      |
| Is there a minimum transaction amount enforced?                    |    P2    | Check for minimum transaction amount enforcement in functions that handle value transfers.                                                 |
| How does the protocol handle tokens with blacklisting functionality? |    P2    | Identify if the protocol interacts with tokens that have blacklisting features. Test the interaction with such tokens on a testnet.        |
| Can forcing the protocol to process a queue lead to DOS?           |    P2    | Analyze queue processing logic for potential gas limit issues or unbounded loops.                                                          |
| What happens with low decimal tokens that might cause DOS?         |    P3    | Test with tokens that have a low number of decimals to see if it causes issues with calculations.                                          |
| Does the protocol handle external contract interactions safely?    |    P1    | Use tools like Slither to detect unsafe external calls. Manually review all external calls for reentrancy and other vulnerabilities. |

### Donation Attack

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Does the protocol rely on `balance` or `balanceOf` instead of internal accounting? |    P1    | Manually review code to ensure that internal accounting is used instead of relying on `balanceOf`. This is a critical vulnerability. |

### Front-running Attack

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Are "get-or-create" patterns protected against front-running attacks? |    P2    | Review code for "get-or-create" patterns and ensure they are protected against front-running. |
| Are two-transaction actions designed to be safe from frontrunning? |    P2    | Review two-transaction actions (e.g., approve and transferFrom) for front-running vulnerabilities. |
| Can users maliciously cause others' transactions to revert by preempting with dust? |    P3    | This is a more advanced attack vector. Analyze the code for areas where this might be possible. |
| Is the protocol using a properly user-bound commit-reveal scheme?  |    P1    | If a commit-reveal scheme is used, ensure it is implemented correctly and is user-bound. |

### Griefing Attack

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Is there an external function that relies on states that can be changed by others? |    P2    | Manually review external functions to identify reliance on states that can be manipulated by other users. |
| Can the contract operations be manipulated with precise gas limit specifications? |    P3    | This is a complex attack. Analyze critical functions for gas-related vulnerabilities. |

### Miner Attack

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Is block.timestamp used for time-sensitive operations?             |    P1    | `block.timestamp` can be manipulated by miners. Avoid using it for critical time-sensitive operations. Use oracles or other mechanisms. |
| Is the contract using block properties like timestamp or difficulty for randomness generation? |    P1    | Block properties are not a secure source of randomness. Use Chainlink VRF or other secure randomness sources. |
| Is contract logic sensitive to transaction ordering?               |    P2    | Analyze the code for dependencies on transaction order (e.g., front-running). |

### Price Manipulation Attack

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Is the price calculated by the ratio of token balances?            |    P1    | This is vulnerable to flash loan attacks. Use time-weighted average price (TWAP) oracles instead. |
| Is the price calculated from DEX liquidity pool spot prices?       |    P1    | Spot prices are easily manipulated. Use TWAP oracles from reliable sources like Chainlink. |

### Reentrancy Attack

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Is there a view function that can return a stale value during interactions? |    P2    | Review view functions to ensure they do not return stale data during a transaction. |
| Is there any state change after interaction to an external contract? |    P1    | Follow the "checks-effects-interactions" pattern to prevent reentrancy attacks. Use tools like Slither to detect potential reentrancy. |

### Replay Attack

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Are there protections against replay attacks for failed transactions? |    P2    | Implement nonces or other mechanisms to prevent replaying failed transactions. |
| Is there protection against replaying signatures on different chains? |    P1    | Include `chainid` in the signed message hash to prevent cross-chain replay attacks. |

### Rug Pull

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Can the admin of the protocol pull assets from the protocol?       |    P1    | Review admin functions to ensure they cannot arbitrarily withdraw user funds. Look for timelocks or multi-sig requirements. |

### Sandwich Attack

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Does the protocol have an explicit slippage protection on user interactions? |    P1    | Implement slippage protection for swaps and other price-sensitive transactions. |

### Sybil Attack

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Is there a mechanism depending on the number of users?             |    P2    | If the protocol has mechanics based on the number of users, consider how a Sybil attack could be used to manipulate it. |

## Basics

### Access Control

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Did you clarify all the actors and their allowed interactions in the protocol? |    P1    | Create a document outlining all roles and their permissions. Use this as a reference during the audit. |
| Are there functions lacking proper access controls?                |    P1    | Review all functions and ensure that they have proper access control modifiers (e.g., `onlyOwner`, `onlyRole`). |
| Do certain addresses require whitelisting?                         |    P2    | If whitelisting is used, ensure the implementation is correct and secure. |
| Does the protocol allow transfer of privileges?                    |    P1    | Review privilege transfer functions for security vulnerabilities. Ensure they are protected by multi-sig or timelocks. |
| What happens during the transfer of privileges?                    |    P1    | Analyze the process of transferring privileges to ensure it is secure and does not leave the protocol in a vulnerable state. |
| Does the contract inherit others?                                  |    P3    | Review inherited contracts for potential security issues. |
| Does the contract use `tx.origin` in validation?                   |    P1    | `tx.origin` should not be used for authorization. Use `msg.sender` instead. |

### Array / Loop

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| What happens on the first and the last cycle of the iteration?     |    P2    | Test loops with edge cases, including the first and last iterations. |
| How does the protocol remove an item from an array?                |    P2    | Review array deletion logic to ensure it works as expected and doesn't leave gaps in the array. |
| Does any function get an index of an array as an argument?         |    P3    | Validate user-provided array indices to prevent out-of-bounds errors. |
| Is the summing of variables done accurately compared to separate calculations? |    P3    | Be aware of potential precision loss or overflow when summing variables. |
| Is it fine to have duplicate items in the array?                   |    P3    | Consider the implications of duplicate items in arrays. |
| Is there any issue with the first and the last iteration?          |    P2    | Test loops with edge cases, including the first and last iterations. |
| Is there possibility of iteration of a huge array?                 |    P1    | Unbounded loops can lead to DoS attacks. Avoid iterating over arrays that can grow indefinitely. |
| Is there a potential for a Denial-of-Service (DoS) attack in the loop? |    P1    | Analyze loops for potential DoS vulnerabilities, such as gas limit issues or infinite loops. |
| Is `msg.value` used within a loop?                                 |    P1    | Using `msg.value` in a loop is an anti-pattern and can lead to vulnerabilities. |
| Is there a loop to handle batch fund transfer?                     |    P1    | Batch fund transfers in a loop can lead to DoS if one of the transfers fails. Use a pull-based payment system instead. |
| Is there a break or continue inside a loop?                        |    P3    | Review the logic of loops with `break` or `continue` to ensure they behave as expected. |

### Block Reorganization

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Does the protocol implement a factory pattern using the CREATE opcode? |    P3    | Be aware of potential issues with block reorganizations when using the `CREATE` opcode. |

### Event

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Does the protocol emit events on important state changes?          |    P2    | Emit events for all critical state changes to allow for off-chain monitoring and debugging. |

### Function

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Are the inputs validated?                                          |    P1    | Always validate all inputs to functions to prevent unexpected behavior. |
| Are the outputs validated?                                         |    P2    | Validate the outputs of functions, especially those that return values from external calls. |
| Can the function be front-run?                                     |    P2    | Analyze functions for front-running vulnerabilities, especially those that involve price-sensitive operations. |
| Are the code comments coherent with the implementation?            |    P3    | Ensure that code comments are accurate and up-to-date. |
| Can edge case inputs (0, max) result in unexpected behavior?       |    P2    | Test functions with edge case inputs, such as 0, max values, and empty strings. |
| Does the function allow arbitrary user input?                      |    P1    | Be very careful with functions that allow arbitrary user input, as this can be a source of vulnerabilities. |
| Should it be `external`/`public`?                                  |    P2    | Use the most restrictive visibility for functions. Prefer `external` over `public`. |
| Does this function need to be called by only EOA or only contracts? |    P2    | Consider whether a function should only be callable by EOAs or other contracts. |
| Does this function need to be restricted for specific callers?     |    P1    | Use access control modifiers to restrict access to sensitive functions. |

### Inheritance

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Is it necessary to limit visibility of parent contract's public functions? |    P2    | Consider limiting the visibility of functions from inherited contracts if they are not needed. |
| Were all necessary functions implemented to fulfill inheritance purpose? |    P2    | Ensure that all required functions from inherited contracts are implemented. |
| Has the contract implemented an interface?                         |    P3    | If the contract implements an interface, ensure that it correctly implements all the functions in the interface. |
| Does the inheritance order matter?                                 |    P2    | Be aware of the order of inheritance, as it can affect the behavior of the contract. |

### Initialization

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Are important state variables initialized properly?                |    P1    | Ensure that all state variables are initialized correctly in the constructor or initializer function. |
| Has the contract inherited OpenZeppelin's Initializable?           |    P2    | If the contract is upgradeable, it should inherit from OpenZeppelin's `Initializable` contract. |
| Does the contract have a separate initializer function other than a constructor? |    P2    | For upgradeable contracts, use an initializer function instead of a constructor. |

### Map

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Is there need to delete the existing item from a map?              |    P3    | Deleting items from a map is not possible in Solidity. Set the value to zero instead. |

### Math

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Is the mathematical calculation accurate?                          |    P1    | Use safe math libraries like OpenZeppelin's `SafeMath` to prevent overflow and underflow vulnerabilities. |
| Is there any loss of precision in time calculations?               |    P2    | Be aware of potential precision loss when working with time units. |
| Are you aware that expressions like `1 day` are cast to `uint24`, potentially causing overflows? |    P2    | Be careful with time units, as they can cause overflows. |
| Is there any case where dividing is done before multiplication?    |    P1    | Perform multiplication before division to avoid precision loss. |
| Does the rounding direction matter?                                |    P2    | Consider the rounding direction when performing calculations. |
| Is there a possibility of division by zero?                        |    P1    | Always check for division by zero. |
| Even in versions like `>0.8.0`, have you ensured variables won't underflow or overflow leading to reverts? |    P1    | Even with built-in overflow protection, it's important to be mindful of potential overflows. |
| Are you aware that assigning a negative value to an unsigned integer causes a revert? |    P2    | Be careful when casting between signed and unsigned integers. |
| Have you properly reviewed all usages of `unchecked{}`?            |    P1    | Use `unchecked` with extreme caution, as it disables overflow and underflow checks. |
| In comparisons using < or >, should you instead be using ≤ or ≥?   |    P2    | Use the correct comparison operators to avoid off-by-one errors. |
| Have you taken into consideration mathematical operations in inline assembly? |    P2    | Be very careful with mathematical operations in inline assembly, as they are not checked for overflows. |
| What happens for the minimum/maximum values included in the calculation? |    P2    | Test mathematical calculations with edge case values. |

### Payment

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Is it possible for the receiver to revert?                         |    P1    | Use a pull-based payment system to avoid issues with receivers that revert. |
| Does the function gets the payment amount as a parameter?          |    P2    | Be careful with functions that accept payment amounts as parameters. |
| Are there vulnerabilities related to force-feeding?                |    P2    | Be aware of vulnerabilities related to force-feeding ETH to contracts. |
| What is the minimum deposit/withdrawal amount?                     |    P2    | Consider setting a minimum deposit and withdrawal amount to prevent dust attacks. |
| How is the withdrawal handled?                                     |    P1    | Use the "pull-over-push" pattern for withdrawals. |
| Is `transfer()` or `send()` used for sending ETH?                  |    P1    | Avoid using `transfer()` and `send()`. Use `.call{value: ...}("")` instead. |
| Is it possible for native ETH to be locked in the contract?        |    P1    | Ensure that there is a way to withdraw any native ETH that is sent to the contract. |

### Proxy/Upgradable

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Is there a constructor in the proxied contract?                    |    P1    | The implementation contract should not have a constructor. Use an initializer function instead. |
| Is the `initializer` modifier applied to the `initialization()` function? |    P1    | The initializer function should have the `initializer` modifier to prevent it from being called multiple times. |
| Is the upgradable version used for initialization?                 |    P1    | Use the upgradeable version of contracts for initialization. |
| Is the `authorizeUpgrade()` function properly secured in a UUPS setup? |    P1    | The `authorizeUpgrade()` function should be protected with proper access control. |
| Is the contract initialized?                                       |    P1    | Ensure that the contract is initialized before it is used. |
| Are `selfdestruct` and `delegatecall` used within the implementation contracts? |    P1    | Avoid using `selfdestruct` and `delegatecall` in implementation contracts. |
| Are values in immutable variables preserved between upgrades?      |    P2    | Immutable variables are not preserved between upgrades. |
| Has the contract inherited the correct branch of OpenZeppelin library? |    P2    | Use the upgradeable version of OpenZeppelin contracts. |
| Could an upgrade of the contract result in storage collision?      |    P1    | Ensure that storage layout is not changed between upgrades to avoid storage collisions. |
| Are the order and types of storage variables consistent between upgrades? |    P1    | The order and types of storage variables must be consistent between upgrades. |

### Type

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Is there a forced type casting?                                    |    P2    | Be careful with forced type casting, as it can lead to unexpected behavior. |
| Does the protocol use time units like `days`?                      |    P2    | Be careful with time units, as they can be a source of vulnerabilities. |

### Version Issues

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| EIP-4758: Does the contract use `selfdestruct()`?                  |    P1    | The `selfdestruct` opcode is being deprecated. Avoid using it. |
| Does the contract use `ERC2771Context`? (version >=4.0.0 <4.9.3)    |    P2    | Check for known vulnerabilities in the specific version of `ERC2771Context` used. |
| Does the contract use OpenZeppelin's GovernorCompatibilityBravo? (version >=4.3.0 <4.8.3) |    P2    | Check for known vulnerabilities in the specific version of `GovernorCompatibilityBravo` used. |
| Does the contract use OpenZeppelin's ECDSA.recover or ECDSA.tryRecover? (version <4.7.3) |    P2    | Check for known vulnerabilities in the specific version of `ECDSA` used. |
| Does the contract use OpenZeppelin's ERC777? (version <3.4.0-rc.0) |    P2    | Check for known vulnerabilities in the specific version of `ERC777` used. |
| Does the contract use OpenZeppelin's `MerkleProof`? (version >=4.7.0 <4.9.2) |    P2    | Check for known vulnerabilities in the specific version of `MerkleProof` used. |
| Does the contract use OpenZeppelin's Governor or GovernorCompatibilityBravo? (version >=4.3.0 <4.9.1) |    P2    | Check for known vulnerabilities in the specific version of `Governor` used. |
| Does the contract use OpenZeppelin's TransparentUpgradeableProxy? (version >=3.2.0 <4.8.3) |    P2    | Check for known vulnerabilities in the specific version of `TransparentUpgradeableProxy` used. |
| Does the contract use OpenZeppelin's ERC721Consecutive?(version >=4.8.0 <4.8.2) |    P2    | Check for known vulnerabilities in the specific version of `ERC721Consecutive` used. |
| Does the contract use OpenZeppelin's ERC165Checker or ERC165CheckerUpgradeable? (version >=2.3.0 <4.7.2) |    P2    | Check for known vulnerabilities in the specific version of `ERC165Checker` used. |
| Does the contract use OpenZeppelin's LibArbitrumL2 or CrossChainEnabledArbitrumL2? (version >=4.6.0 <4.7.2) |    P2    | Check for known vulnerabilities in the specific version of `LibArbitrumL2` used. |
| Does the contract use OpenZeppelin's GovernorVotesQuorumFraction? (version >=4.3.0 <4.7.2) |    P2    | Check for known vulnerabilities in the specific version of `GovernorVotesQuorumFraction` used. |
| Does the contract use OpenZeppelin's SignatureChecker? (version >=4.1.0 <4.7.1) |    P2    | Check for known vulnerabilities in the specific version of `SignatureChecker` used. |
| Does the contract use OpenZeppelin's ERC165Checker? (version >=4.0.0 <4.7.1) |    P2    | Check for known vulnerabilities in the specific version of `ERC165Checker` used. |
| Does the contract use OpenZeppelin's GovernorCompatibilityBravo? (version >=4.3.0 <4.4.2) |    P2    | Check for known vulnerabilities in the specific version of `GovernorCompatibilityBravo` used. |
| Does the contract use OpenZeppelin's Initializable? (version >=3.2.0 <4.4.1) |    P2    | Check for known vulnerabilities in the specific version of `Initializable` used. |
| Does the contract use OpenZeppelin's ERC1155? (version >=4.2.0 <4.3.3) |    P2    | Check for known vulnerabilities in the specific version of `ERC1155` used. |
| Does the contract use OpenZeppelin's UUPSUpgradeable? (version >=4.1.0 <4.3.2) |    P2    | Check for known vulnerabilities in the specific version of `UUPSUpgradeable` used. |
| Does the contract use OpenZeppelin's TimelockController? (version >=4.0.0-beta.0 <4.3.1\n<3.4.2) |    P2    | Check for known vulnerabilities in the specific version of `TimelockController` used. |
| Does the contract encode storage structs or arrays with types under 32 bytes directly using experimental ABIEncoderV2? (version 0.5.0~0.5.6) |    P2    | Check for known vulnerabilities related to `ABIEncoderV2`. |
| Are there any instances where empty strings are directly passed to function calls? (version ~0.4.11) |    P2    | Check for known vulnerabilities related to empty strings. |
| Does the optimizer replace specific constants with alternative computations? (version ~0.4.10) |    P2    | Check for known vulnerabilities related to the optimizer. |
| Does the contract use `abi.encodePacked`, especially in hash generation? (version >= 0.8.17) |    P2    | `abi.encodePacked` can lead to hash collisions. Use `abi.encode` instead. |
| BUILD: Is the contract optimized using sequences containing FullInliner with non-expression-split code? (version 0.6.7~0.8.20) |    P2    | Check for known vulnerabilities related to the optimizer. |
| Are there any functions that conditionally terminate inside an inline assembly? (version 0.8.13~0.8.16) |    P2    | Check for known vulnerabilities related to inline assembly. |
| Are tuples containing a statically-sized calldata array at the end being ABI-encoded? (version 0.5.8~0.8.15) |    P2    | Check for known vulnerabilities related to `ABIEncoderV2`. |
| Does the contract have functions that copy `bytes` arrays from memory or calldata directly to storage? (version 0.0.1~0.8.14) |    P2    | Check for known vulnerabilities related to copying arrays to storage. |
| Is there a function with multiple inline assembly blocks? (version 0.8.13~0.8.14) |    P2    | Check for known vulnerabilities related to inline assembly. |
| Is a nested array being ABI-encoded or passed directly to an external function? (version 0.5.8~0.8.13) |    P2    | Check for known vulnerabilities related to `ABIEncoderV2`. |
| Is `abi.encodeCall` used together with fixed-length bytes literals? (version 0.8.11~0.8.12) |    P2    | Check for known vulnerabilities related to `abi.encodeCall`. |
| Is there any user defined types based on types shorter than 32 bytes? (version =0.8.8) |    P2    | Check for known vulnerabilities related to user-defined types. |
| Is there an immutable variable of signed integer type shorter than 256 bits? (version 0.6.5~0.8.8) |    P2    | Check for known vulnerabilities related to immutable variables. |
| Is there any use of `abi.encode` on memory with multi-dimensional array or structs? (version 0.4.16~0.8.3) |    P2    | Check for known vulnerabilities related to `abi.encode`. |
| Is there an inline assembly block with `keccak256` inside? (version ~0.8.2) |    P2    | Check for known vulnerabilities related to `keccak256` in inline assembly. |
| Is there a copy of an empty `bytes` or `string` from `memory` or `calldata` to `storage`? (version ~0.7.3) |    P2    | Check for known vulnerabilities related to copying empty arrays to storage. |
| Is there a dynamically-sized storage-array with types of size at most 16 bytes? (version ~0.7.2) |    P2    | Check for known vulnerabilities related to dynamically-sized storage arrays. |
| Does the library use contract types in events? (version 0.5.0~0.5.7) |    P2    | Check for known vulnerabilities related to contract types in events. |
| Does the contract use internal library functions with calldata parameters via `using for`? (version =0.6.9) |    P2    | Check for known vulnerabilities related to `using for`. |
| Are string literals with double backslashes passed directly to external or encoding functions with ABIEncoderV2 enabled? (version 0.5.14~0.6.7) |    P2    | Check for known vulnerabilities related to `ABIEncoderV2`. |
| Does the contract access slices of dynamic arrays, especially multi-dimensional ones? (version 0.6.0~0.6.7) |    P2    | Check for known vulnerabilities related to dynamic arrays. |
| Is there a contract with creation code, no constructor, but a base with a constructor that accepts non-zero values? (version 0.4.5~0.6.7) |    P2    | Check for known vulnerabilities related to constructors. |
| Does the contract create extremely large memory arrays? (version 0.2.0~0.6.4) |    P2    | Check for known vulnerabilities related to large memory arrays. |
| Does the contract's inline assembly with Yul optimizer use assignments inside for loops combined with continue or break? (version =0.6.0) |    P2    | Check for known vulnerabilities related to the Yul optimizer. |
| Does the contract allow private methods to be overridden by inheriting contracts? (version 0.3.0~0.5.16) |    P2    | Check for known vulnerabilities related to private methods. |
| Is there any Yul's continue or break statement inside the loop?? (version 0.5.8~0.5.15) |    P2    | Check for known vulnerabilities related to the Yul optimizer. |
| Are both experimental ABIEncoderV2 and Yul optimizer activated? (version =0.5.14) |    P2    | Check for known vulnerabilities related to `ABIEncoderV2` and the Yul optimizer. |
| Does the contract read from calldata structs with dynamic yet statically-sized members? (version 0.5.6~0.5.10) |    P2    | Check for known vulnerabilities related to `ABIEncoderV2`. |
| Does the contract assign arrays of signed integers to differently typed storage arrays? (version 0.4.7~0.5.9) |    P2    | Check for known vulnerabilities related to signed integers. |
| Does the contract directly encode storage arrays with structs or static arrays in external calls or abi.encode*? (version 0.4.16~0.5.9) |    P2    | Check for known vulnerabilities related to `ABIEncoderV2`. |
| Does the contract's constructor accept structs or arrays with dynamic arrays? (version 0.4.16~0.5.8) |    P2    | Check for known vulnerabilities related to constructors. |
| Are uninitialized internal function pointers created in the constructor being called? (version 0.5.0~0.5.7) |    P2    | Check for known vulnerabilities related to function pointers. |
| Are uninitialized internal function pointers created in the constructor being called? (version 0.4.5~0.4.25) |    P2    | Check for known vulnerabilities related to function pointers. |
| Does the library use contract types in events? (version 0.3.0~0.4.25) |    P2    | Check for known vulnerabilities related to contract types in events. |
| Does the contract encode storage structs or arrays with types under 32 bytes directly using experimental ABIEncoderV2? (version 0.4.19~0.4.25) |    P2    | Check for known vulnerabilities related to `ABIEncoderV2`. |
| Does the contract's optimizer handle byte opcodes with a second argument of 31 or an equivalent constant expression? (version 0.5.5~0.5.6) |    P2    | Check for known vulnerabilities related to the optimizer. |
| Are there double bitwise shifts with large constants that might sum up to overflow 256 bits? (version =0.5.5) |    P2    | Check for known vulnerabilities related to bitwise shifts. |
| Is the ** operator used with an exponent type shorter than 256 bits? (version ~0.4.24) |    P2    | Check for known vulnerabilities related to the `**` operator. |
| Are structs used in the logged events? (version 0.4.17~0.4.24) |    P2    | Check for known vulnerabilities related to structs in events. |
| Are functions returning multi-dimensional fixed-size arrays called? (version 0.1.4~0.4.21) |    P2    | Check for known vulnerabilities related to multi-dimensional arrays. |
| Does the contract use both new-style and old-style constructors simultaneously? (version =0.4.22) |    P2    | Check for known vulnerabilities related to constructors. |
| Is there a function name crafted to potentially override the fallback function execution? (version ~0.4.17) |    P2    | Check for known vulnerabilities related to fallback functions. |
| Is the low-level .delegatecall() used without checking the actual execution outcome? (version 0.3.0~0.4.14) |    P2    | Always check the return value of `delegatecall`. |
| Is the ecrecover() function used without validating its input? (version ~0.4.13) |    P2    | Always validate the input to `ecrecover`. |
| Is the `.selector` member accessed on complex expressions? (version 0.6.2~0.8.20) |    P2    | Check for known vulnerabilities related to `.selector`. |
| Is there any inconsistency (`memory` vs `calldata`) in the param type during inheritance? (version 0.6.9~0.8.13) |    P2    | Check for inconsistencies in parameter types during inheritance. |
| Are there any functions with the same name and parameter type inside the same contract? (version =0.7.1) |    P2    | Check for duplicate function signatures. |
| Does the contract use tuple assignments with multi-stack-slot components, like nested tuples or dynamic calldata references? (version 0.1.6~0.6.5) |    P2    | Check for known vulnerabilities related to tuple assignments. |

## Centralization Risk

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| What happens to the user accounting in special conditions?         |    P2    | Analyze the protocol's behavior in edge cases and special conditions to ensure user funds are safe. |
| Is there a pause mechanism?                                        |    P2    | If there is a pause mechanism, ensure it is properly secured and that the admin cannot abuse it. |
| Is there a functionality for the admin to withdraw from the protocol? |    P1    | Review admin functions to ensure they cannot arbitrarily withdraw user funds. Look for timelocks or multi-sig requirements. |
| Can the admin change critical protocol property immediately?       |    P1    | Critical protocol properties should be protected by a timelock. |
| Is there any admin setter function missing events?                 |    P2    | All admin setter functions should emit events to ensure transparency. |
| How is the ownership/privilege transferred??                       |    P1    | The process of transferring ownership or privileges should be secure and well-documented. |
| Is there a proper validation in privileged setter functions?       |    P1    | All privileged setter functions should have proper validation to prevent errors. |

## Defi

### AMM/Swap

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Is hardcoded slippage used?                                        |    P2    | Avoid using hardcoded slippage. Allow users to specify their own slippage tolerance. |
| Is there a deadline protection?                                    |    P1    | All swaps should have a deadline to protect against front-running and other attacks. |
| Is there a validation check for protocol reserves?                 |    P2    | Validate protocol reserves to ensure they are not drained. |
| Does the AMM utilize forked code?                                  |    P3    | If the AMM uses forked code, ensure that it is from a reputable source and has been audited. |
| Are there rounding issues in product constant formulas?            |    P2    | Be aware of potential rounding issues in AMM formulas. |
| Can arbitrary calls be made from user input?                       |    P1    | Be careful with functions that allow arbitrary calls based on user input. |
| Is there a mechanism in place to protect against excessive slippage? |    P1    | Implement slippage protection to protect users from excessive slippage. |
| Does the AMM properly handle tokens of varying decimal configurations and token types? |    P2    | Test the AMM with tokens of different decimal configurations and types. |
| Does the AMM support the fee-on-transfer tokens?                   |    P2    | Be aware of potential issues when interacting with fee-on-transfer tokens. |
| Does the AMM support the rebasing tokens?                          |    P2    | Be aware of potential issues when interacting with rebasing tokens. |
| Does the protocol calculate `minAmountOut` before a token swap?    |    P1    | Calculate `minAmountOut` before a swap to protect users from slippage. |
| Does the integrating contract verify the caller address in its callback functions? |    P1    | Verify the caller address in callback functions to prevent unauthorized calls. |
| Is the slippage calculated on-chain?                               |    P2    | On-chain slippage calculation can be manipulated. Prefer off-chain calculation. |
| Is the slippage parameter enforced at the last step before transferring funds to users? |    P1    | Enforce the slippage parameter at the last step to prevent manipulation. |

### FlashLoan

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Is withdraw disabled in the same block to prevent flashloan attacks? |    P1    | Disable withdrawals in the same block as a deposit to prevent flash loan attacks. |
| Can ERC4626 be manipulated through flashloans?                     |    P1    | Be aware of potential flash loan attacks on ERC4626 vaults. |

### General

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Can the protocol handle ERC20 tokens with decimals other than 18?  |    P2    | Test the protocol with tokens that have different decimal configurations. |
| Are there unexpected rewards accruing for user deposited assets?   |    P2    | Review reward calculation logic to ensure it is correct. |
| Could direct transfers of funds introduce vulnerabilities?         |    P2    | Be careful with direct transfers of funds, as they can introduce vulnerabilities. |
| Could the initial deposit introduce any issues?                    |    P2    | Test the protocol with an initial deposit to ensure it behaves as expected. |
| Are the protocol token pegged to any other asset?                  |    P2    | If the protocol token is pegged to another asset, ensure the peg is stable. |
| Does the protocol revert on maximum approval to prevent over-allowance? |    P2    | Consider reverting on maximum approval to prevent over-allowance issues. |
| What would happen if only 1 wei remains in the pool?               |    P3    | Test the protocol with very small amounts to ensure it behaves as expected. |
| Is it possible to withdraw in the same transaction of deposit?     |    P2    | Consider the implications of allowing withdrawals in the same transaction as a deposit. |
| Does the protocol aim to support ALL kinds of ERC20 tokens?        |    P2    | Be aware of the challenges of supporting all types of ERC20 tokens. |

### Lending

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Will the liquidation process function effectively during rapid market downturns? |    P1    | Stress-test the liquidation process to ensure it works in volatile market conditions. |
| Can a position be liquidated if the loan remains unpaid or if the collateral falls below the required threshold? |    P1    | Ensure that liquidations are triggered correctly when a loan is undercollateralized. |
| Is it possible for a user to gain undue profit from self-liquidation? |    P2    | Prevent users from profiting from self-liquidation. |
| If token transfers or collateral additions are temporarily paused, can a user still be liquidated, even if they intend to deposit more funds? |    P2    | Consider the implications of pausing token transfers on liquidations. |
| If liquidations are temporarily suspended, what are the implications when they are resumed? |    P2    | Consider the implications of pausing and resuming liquidations. |
| Is it possible for users to manipulate the system by front-running and slightly increasing their collateral to prevent liquidations? |    P2    | Analyze the liquidation process for front-running vulnerabilities. |
| Are all positions, regardless of size, incentivized adequately for liquidation? |    P2    | Ensure that there is an incentive to liquidate all positions, regardless of their size. |
| Is interest considered during Loan-to-Value (LTV) calculation?     |    P1    | Ensure that interest is correctly factored into the LTV calculation. |
| Can liquidation and repaying be enabled or disabled simultaneously? |    P2    | Consider the implications of enabling or disabling liquidations and repayments. |
| Is it possible to lend and borrow the same token within a single transaction? |    P2    | Consider the implications of lending and borrowing the same token in a single transaction. |
| Is there a scenario where a liquidator might receive a lesser amount than anticipated? |    P2    | Ensure that liquidators receive the correct amount of collateral. |
| Is it possible for a user to be in a condition where they cannot repay their loan? |    P2    | Analyze the protocol for scenarios where a user might be unable to repay their loan. |

### Liquid Staking Derivatives

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Can a malicious validator front-run setting withdrawal credentials? |    P1    | Protect against front-running attacks when setting withdrawal credentials. |
| Can the exchange rate repricing update be sandwich attacked to drain ETH from the protocol? |    P1    | Protect against sandwich attacks on exchange rate updates. |
| Can re-entrancy when ETH is sent during rewards/withdrawals or when NFTs are minted via `_safeMint` (to represent pending withdrawals) be used to drain the protocol's ETH? |    P1    | Protect against re-entrancy attacks during reward distribution and withdrawals. |
| Can an arbitrary exchange rate be set when processing queued withdrawals? |    P1    | Prevent arbitrary exchange rates from being set during withdrawal processing. |
| Can paused states be bypassed to perform restricted actions even when they should be paused? |    P1    | Ensure that paused states cannot be bypassed. |
| Can inter-related storage be corrupted, especially storage related to operators and validators? |    P2    | Protect against corruption of inter-related storage. |
| Does the protocol iterate over the entire set of operators or validators? |    P1    | Avoid iterating over large sets of operators or validators to prevent DoS attacks. |
| If using a Proof Of Reserves Oracle, does the protocol check for stale data? |    P1    | Ensure that the protocol checks for stale data from oracles. |
| Does unnecessary precision loss occur in deposit, withdrawal or reward calculations? |    P2    | Avoid unnecessary precision loss in calculations. |

### Oracle

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Is the Oracle using deprecated Chainlink functions?                |    P2    | Avoid using deprecated Chainlink functions. |
| Is the returned price validated to be non-zero?                    |    P1    | Always validate that the returned price from an oracle is non-zero. |
| Is the price update time validated?                                |    P1    | Validate the timestamp of the price update to protect against stale prices. |
| Is there a validation to check if the rollup sequencer is running? |    P1    | If the protocol is running on a rollup, check if the sequencer is running. |
| Is the Oracle's TWAP period appropriately set?                     |    P1    | Set the TWAP period appropriately to protect against price manipulation. |
| Is the desired price feed pair supported across all deployed chains? |    P2    | Ensure that the price feed pair is supported on all chains where the protocol is deployed. |
| Is the heartbeat of the price feed suitable for the use case?      |    P2    | Ensure that the heartbeat of the price feed is suitable for the protocol's use case. |
| Are there any inconsistencies with decimal precision when using different price feeds? |    P2    | Be aware of potential inconsistencies in decimal precision when using different price feeds. |
| Is the price feed address hard-coded?                              |    P2    | Avoid hard-coding price feed addresses. Make them configurable. |
| What happens if oracle price updates are front-run?                |    P1    | Protect against front-running attacks on oracle price updates. |
| How does the system handle potential oracle reverts?               |    P2    | Handle potential oracle reverts gracefully. |
| Are the price feeds appropriate for the underlying assets?         |    P1    | Use appropriate price feeds for the underlying assets. |
| Is the contract vulnerable to oracle manipulation, especially using spot prices from AMMs? |    P1    | Protect against oracle manipulation attacks. |
| How does the system address potential inaccuracies during flash crashes? |    P1    | Implement mechanisms to protect against flash crashes. |

### Staking

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Can a user amplify another user's time lock duration by stacking tokens on their behalf? |    P2    | Prevent users from amplifying the time lock duration of other users. |
| Can the distribution of rewards be unduly delayed or prematurely claimed? |    P2    | Ensure that rewards are distributed in a timely and fair manner. |
| Are rewards up-to-date in all use-cases?                           |    P2    | Ensure that rewards are up-to-date in all use cases. |

## External Call

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| What are the implications if the call reenters a different function? |    P1    | Analyze the code for re-entrancy vulnerabilities. Use the "checks-effects-interactions" pattern. |
| Is there a multi-call?                                             |    P2    | Be careful with multi-call functions, as they can introduce complexity and vulnerabilities. |
| What are the risks associated with using delegatecall in smart contracts? |    P1    | `delegatecall` is very dangerous. Use it with extreme caution and only with trusted contracts. |
| Is the external contract call necessary?                           |    P3    | Avoid unnecessary external calls to reduce attack surface. |
| Has the called address been whitelisted?                           |    P2    | Whitelist trusted contracts that can be called. |
| Is there suspicion when a fixed gas amount is specified?           |    P2    | Be careful with fixed gas amounts, as they can be a source of vulnerabilities. |
| What happens if the call consumes all provided gas?                |    P1    | Handle potential out-of-gas errors gracefully. |
| Is the contract passing large data to an unknown address?          |    P2    | Be careful when passing large amounts of data to unknown addresses. |
| What happens if the call returns vast data?                        |    P2    | Be careful with calls that can return large amounts of data. |
| Are there any delegate calls to non-library contracts?             |    P1    | Avoid using `delegatecall` to non-library contracts. |
| Is there a strict policy against delegate calls to untrusted contracts? |    P1    | Do not use `delegatecall` with untrusted contracts. |
| Is the address's existence verified?                               |    P1    | Check if the address exists before calling it. |
| Is the check-effect-interaction pattern being utilized?            |    P1    | Always use the "checks-effects-interactions" pattern to prevent re-entrancy attacks. |
| How is the msg.sender handled?                                     |    P1    | Be aware of how `msg.sender` is handled in external calls. |

## Hash / Merkle Tree

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Is the Merkle tree vulnerable to front-running attacks?            |    P2    | Protect Merkle tree claims from front-running attacks. |
| Does the claim method validate `msg.sender`?                       |    P1    | Validate `msg.sender` in the claim method to prevent unauthorized claims. |
| What is the result when passing a zero hash to the Merkle tree functions? |    P2    | Test Merkle tree functions with a zero hash to ensure they behave as expected. |
| What occurs if the same proof is duplicated within the Merkle tree? |    P2    | Prevent duplicate proofs from being used in the Merkle tree. |
| Are the leaves of the Merkle tree hashed with the claimable address included? |    P1    | Include the claimable address in the Merkle tree leaves to prevent replay attacks. |

## Heuristics

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Is there any logic implemented multiple times?                     |    P3    | Avoid code duplication. Use functions or libraries instead. |
| Does the contract use any nested structures?                       |    P3    | Be careful with nested structures, as they can increase complexity. |
| Is there any unexpected behavior when `src==dst` (or `caller==receiver`)? |    P2    | Test functions with `src==dst` to ensure they behave as expected. |
| Is the NonReentrant modifier placed before every other modifier?   |    P2    | Place the `nonReentrant` modifier before other modifiers to ensure it is effective. |
| Does the `try/catch` block account for potential gas shortages?    |    P2    | Handle potential gas shortages in `try/catch` blocks. |
| Did you check the relevant EIP recommendations and security concerns? |    P2    | Stay up-to-date with the latest EIPs and security recommendations. |
| Are there any off-by-one errors?                                   |    P2    | Be careful with off-by-one errors in loops and comparisons. |
| Are logical operators used correctly?                              |    P2    | Use logical operators correctly to avoid bugs. |
| What happens if the protocol's contracts are inputted as if they are normal actors? |    P2    | Test the protocol with its own contracts as inputs. |
| Are there rounding errors that can be amplified?                   |    P2    | Be aware of potential rounding errors that can be amplified. |
| Is there any uninitialized state?                                  |    P1    | Ensure that all state variables are initialized. |
| Can functions be invoked multiple times with identical parameters? |    P2    | Consider the implications of calling functions multiple times with the same parameters. |
| Is the global state updated correctly?                             |    P1    | Ensure that the global state is updated correctly after each transaction. |
| Is ETH/WETH handling implemented correctly?                        |    P1    | Handle ETH and WETH correctly to avoid vulnerabilities. |
| Does the protocol put any sensitive data on the blockchain?        |    P2    | Avoid storing sensitive data on the blockchain. |
| Are there any code asymmetries?                                    |    P3    | Look for code asymmetries that could indicate a bug. |
| Does calling a function multiple times with smaller amounts yield the same contract state as calling it once with the aggregate amount? |    P2    | Test functions for idempotency. |

## Integrations

### AAVE / Compound

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Does the protocol use cETH token?                                  |    P2    | Be aware of the specifics of the cETH token. |
| What happens if the utilization rate is too high, and collateral cannot be retrieved? |    P1    | Handle high utilization rates gracefully. |
| What happens if the protocol is paused?                            |    P2    | Consider the implications of the underlying protocol being paused. |
| What happens if the pool becomes deprecated?                       |    P2    | Handle deprecated pools gracefully. |
| What happens if assets you lend/borrow are within the same eMode category? |    P2    | Be aware of the specifics of AAVE's eMode. |
| Do flash loans on Aave inflate the pool index?                     |    P1    | Be aware of how flash loans can affect the pool index. |
| Does the protocol properly implement AAVE/COMP reward claims?      |    P2    | Implement reward claims correctly. |
| On AAVE, what happens if a user reaches the maximum debt on an isolated asset? |    P2    | Handle maximum debt on isolated assets correctly. |
| Does borrowing an AAVE siloed asset restrict borrowing other assets? |    P2    | Be aware of the restrictions of siloed assets. |

### Balancer

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Does the protocol use the Balancer's flashloan?                    |    P1    | Be aware of the specifics of Balancer's flash loans. |
| Does the protocol use Balancer's Oracle? (getTimeWeightedAverage)  |    P1    | Use Balancer's TWAP oracle correctly. |
| Does the protocol use Balancer's Boosted Pool?                     |    P2    | Be aware of the specifics of Balancer's Boosted Pools. |
| Does the protocol use Balancer vault pool liquidity status for any pricing? |    P1    | Do not use Balancer's vault pool liquidity status for pricing. |

### Chainlink CCIP

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Does the receiver contract's `_ccipReceive` function properly validate the `sourceChainSelector` and `sender` address against an allowlist? |    P1    | Validate the `sourceChainSelector` and `sender` address in `_ccipReceive`. |
| Does the sender contract validate the `destinationChainSelector` against an allowlist before calling `ccipSend`? |    P1    | Validate the `destinationChainSelector` before calling `ccipSend`. |
| Does the receiver contract properly decode data (`any2EvmMessage.data`) ? |    P1    | Decode data in the receiver contract correctly. |
| Does the application logic account for the potential latency introduced by waiting for source chain finality as defined by CCIP? |    P2    | Account for latency in cross-chain messaging. |
| Are the correct types of token pools (e.g., `BurnMintTokenPool`, `LockReleaseTokenPool`) deployed on the source and destination chains consistent with the desired token handling mechanism? |    P2    | Use the correct token pool types for cross-chain token transfers. |
| Is proper router address verification implemented in the ccipReceive method? |    P1    | Verify the router address in `ccipReceive`. |
| Are extraArgs parameters hardcoded instead of mutable in cross-chain message configurations? |    P2    | Avoid hard-coding `extraArgs` parameters. |
| Is there a proper failure handling mechanism for CCIP messages to prevent blocking after Smart Execution window expiration? |    P2    | Handle CCIP message failures gracefully. |

### Chainlink VRF

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Are all parameters properly verified when Chainlink VRF is called? |    P1    | Verify all parameters when calling Chainlink VRF. |
| Is it guaranteed that the operator holds sufficient LINK in the subscription? |    P2    | Ensure that the VRF subscription has enough LINK. |
| Is a sufficiently high request confirmation number chosen considering chain re-orgs? |    P1    | Choose a high enough request confirmation number to protect against chain re-orgs. |
| Are measures in place to prevent VRF calls from being frontrun?    |    P1    | Protect VRF calls from front-running attacks. |

### Gnosis Safe

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Do your modules execute the Guard's hooks?                         |    P2    | Be aware of how Gnosis Safe modules interact with Guards. |
| Does the `execTransactionFromModule()` function increment the nonce? |    P1    | Ensure that `execTransactionFromModule()` increments the nonce. |

### LayerZero

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Does the `_debitFrom` function in ONFT properly validate token ownership and transfer permissions? |    P1    | Validate token ownership and transfer permissions in `_debitFrom`. |
| Which type of mechanism are utilized? Blocking or non-blocking?    |    P2    | Be aware of the difference between blocking and non-blocking LayerZero messages. |
| Is gas estimated accurately for cross-chain messages?              |    P2    | Estimate gas for cross-chain messages accurately. |
| Is the `_lzSend` function correctly utilized when inheriting LzApp? |    P1    | Use `_lzSend` correctly when inheriting from `LzApp`. |
| Is the `ILayerZeroUserApplicationConfig` interface correctly implemented? |    P1    | Implement the `ILayerZeroUserApplicationConfig` interface correctly. |
| Are default contracts used?                                        |    P2    | Be careful when using default LayerZero contracts. |
| Is the correct number of confirmations chosen for the chain?       |    P1    | Choose the correct number of confirmations for the chain. |

### LSD cbETH

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| How is the control over the `cbETH`/`ETH` rate determined? Are there specific addresses with this capability due to the `onlyOracle` modifier? |    P1    | Understand how the `cbETH`/`ETH` rate is controlled. |
| How does the system handle potential decreases in the `cbETH`/`ETH` rate? |    P1    | Handle potential decreases in the `cbETH`/`ETH` rate gracefully. |

### LSD rETH

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Does the application account for potential penalties or slashes?   |    P1    | Account for potential penalties and slashes. |
| How does the system manage rewards accrued from staking?           |    P2    | Manage staking rewards correctly. |
| Does the application handle potential reverts in the `burn()` function when there's insufficient ether in the `RocketDepositPool`? |    P1    | Handle potential reverts in the `burn()` function gracefully. |
| What measures are in place to counter-act potential consensus attacks on RPL nodes? |    P1    | Protect against consensus attacks on RPL nodes. |
| How does the system handle the conversion between `ETH` and `rETH`? |    P1    | Handle the conversion between `ETH` and `rETH` correctly. |

### LSD sfrxETH

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| How does the system handle potential detachment of `sfrxETH` from `frxETH` during reward transfers? |    P1    | Handle potential detachment of `sfrxETH` from `frxETH` gracefully. |
| Is the stability of the `sfrxETH`/`ETH` rate guaranteed or can it decrease in the future? |    P1    | Be aware of the stability of the `sfrxETH`/`ETH` rate. |

### LSD stETH

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Is the application aware that `stETH` is a rebasing token?         |    P1    | Be aware that `stETH` is a rebasing token. |
| Are you aware of the overhead when withdrawing `stETH`/`wstETH`?   |    P2    | Be aware of the overhead when withdrawing `stETH` or `wstETH`. |
| Does the application handle conversions between `stETH` and `wstETH` correctly? |    P1    | Handle conversions between `stETH` and `wstETH` correctly. |

### Uniswap

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Is the slippage calculated on-chain?                               |    P2    | On-chain slippage calculation can be manipulated. Prefer off-chain calculation. |
| Are there refunds after swaps?                                     |    P2    | Be aware of refunds after swaps. |
| Is the order of `token0` and `token1` consistent across chains?    |    P2    | Ensure that the order of `token0` and `token1` is consistent across chains. |
| Are the pools that are being interacted with whitelisted?          |    P2    | Whitelist trusted Uniswap pools. |
| Is there a reliance on pool reserves?                              |    P1    | Do not rely on pool reserves for pricing. Use a TWAP oracle instead. |
| Is `pool.swap()` directly used?                                    |    P1    | Be careful when using `pool.swap()` directly. |
| Is `unchecked` used properly with Uniswap's math libraries?        |    P1    | Use `unchecked` with extreme caution with Uniswap's math libraries. |
| Is the slippage parameter enforced at the last step before transferring funds to users? |    P1    | Enforce the slippage parameter at the last step to prevent manipulation. |
| Is `pool.slot0` being used to calculate sensitive information like current price and exchange rates? |    P1    | Do not use `pool.slot0` for pricing. Use a TWAP oracle instead. |
| Is a hard-coded fee tier parameter being used?                     |    P2    | Avoid hard-coding fee tier parameters. |

## Low Level

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Is there validation on the size of the input data?                 |    P1    | Validate the size of input data to prevent buffer overflows. |
| What happens if there is no matching function signature?           |    P2    | Handle cases where there is no matching function signature. |
| Is it checked if the target address of a call has the code?        |    P1    | Check if the target address has code before calling it. |
| Is there a check on the return data size when calling precompiled code? |    P2    | Check the return data size when calling precompiled contracts. |
| Is there a non-zero check for the denominator?                     |    P1    | Always check for division by zero. |

## Multi-chain/Cross-chain

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Are there assumption of consistency in the `block.number` or `block.timestamp` across chains? |    P1    | Do not assume consistency of `block.number` or `block.timestamp` across chains. |
| Has the protocol been checked for the target chain differences?    |    P2    | Be aware of the differences between chains. |
| Are the EVM opcodes and operations used by the protocol compatible across all targeted chains? |    P2    | Ensure that all EVM opcodes and operations are compatible across all targeted chains. |
| Does the expected behavior of `tx.origin` and `msg.sender` remain consistent across all deployment chains? |    P1    | Be aware of the differences in `tx.origin` and `msg.sender` across chains. |
| Is there any possibility of exploiting low gas fees to execute many transactions? |    P2    | Be aware of the possibility of exploiting low gas fees. |
| Is there consistency in ERC20 decimals across chains?              |    P2    | Ensure consistency of ERC20 decimals across chains. |
| Have contract upgradability implications been evaluated on different chains? |    P2    | Evaluate the implications of contract upgradability on different chains. |
| Have cross-chain messaging implementations been thoroughly reviewed for permissions and functionality? |    P1    | Thoroughly review cross-chain messaging implementations for security vulnerabilities. |
| Is there a whitelist of compatible chains?                         |    P2    | Whitelist compatible chains. |
| Have contracts been checked for compatibility when deployed to the zkSync Era? |    P2    | Check for compatibility with zkSync Era. |
| Is block production consistency ensured?                           |    P1    | Ensure block production consistency. |
| Is `PUSH0` opcode supported for Solidity version `>=0.8.20`?       |    P2    | Be aware of the `PUSH0` opcode. |
| Are there any attributes attached to the bridged assets?           |    P2    | Be aware of attributes attached to bridged assets. |

## Signature

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Are signatures guarded against replay attacks?                     |    P1    | Protect signatures against replay attacks by including a nonce and `chainid`. |
| Are signatures protected against malleability issues?              |    P1    | Protect signatures against malleability issues. |
| Does the returned public key from the signature verification match the expected public key? |    P1    | Verify the returned public key from signature verification. |
| Is the signature originating from the appropriate entity?          |    P1    | Verify that the signature originates from the expected entity. |
| If the signature has a deadline, is it still valid?                |    P1    | Check if the signature has expired. |

## Timelock

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Are timelocks implemented for important changes?                   |    P1    | Use timelocks for all important changes to the protocol. |

## Token

### Fungible : ERC20

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Are safe transfer functions used throughout the contract?          |    P1    | Use `safeTransfer` and `safeTransferFrom` from OpenZeppelin's `SafeERC20` library. |
| Is there potential for a race condition for approvals?             |    P1    | Protect against race conditions for approvals. |
| Could a difference in decimals between ERC20 tokens cause issues?  |    P2    | Be aware of potential issues with different decimals in ERC20 tokens. |
| Does the token implement any form of address whitelisting, blacklisting, or checks? |    P2    | Be aware of tokens with whitelisting, blacklisting, or other checks. |
| Could the use of multiple addresses for a single token lead to complications? |    P2    | Be aware of potential complications with multiple addresses for a single token. |
| Does the token charge fee on transfer?                             |    P2    | Be aware of fee-on-transfer tokens. |
| Can the token be ERC777?                                           |    P1    | Be aware of the re-entrancy risks associated with ERC777 tokens. |
| Does the protocol use Solmate's `ERC20.safeTransferLib`?           |    P2    | Be aware of the specifics of Solmate's `safeTransferLib`. |
| Is there a flash-mint functionality?                               |    P1    | Be aware of flash-mint functionality. |
| What happens on zero amount transfer?                              |    P2    | Test zero amount transfers. |
| Is the token an ERC2612 implementation?                            |    P2    | Be aware of the specifics of ERC2612 tokens. |
| Can the token be sent to any address?                              |    P2    | Be aware of tokens that cannot be sent to certain addresses. |
| Is there a direct approval to a non-zero value?                    |    P1    | Protect against front-running attacks on approvals. |
| Is there a max approval used?                                      |    P2    | Be careful with max approvals. |
| Can the token be paused?                                           |    P2    | Be aware of pausable tokens. |
| Is the decrease allowance feature of transferFrom() handled correctly when the sender is the caller? |    P1    | Handle the decrease allowance feature of `transferFrom` correctly. |

### Non-fungible : ERC721/1155

| Check                                                              | Priority | Tooling/Notes                                                                                                                              |
| ------------------------------------------------------------------ | :------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| How are the minting and transfer implemented?                      |    P1    | Review the minting and transfer implementation for security vulnerabilities. |
| Is the contract safe from reentrancy attack?                       |    P1    | Protect against re-entrancy attacks in ERC721/1155 contracts. |
| Is the OpenZeppelin implementation of ERC721 and ERC1155 safeguarded against reentrancy attacks, especially in the `safeTransferFrom` functions? |    P1    | Be aware of the re-entrancy protection in OpenZeppelin's ERC721/1155 implementation. |
| Is it possible to steal NFT abusing his approval?                  |    P1    | Protect against NFT theft through approval abuse. |
| Does the ERC721/1155 contract correctly implement supportsInterface? |    P2    | Implement `supportsInterface` correctly. |
| Can the contract support both ERC721 and ERC1155 standards?        |    P2    | Be aware of the challenges of supporting both ERC721 and ERC1155. |
| What happens to the airdrops that are engaged to specific NFT?     |    P2    | Handle airdrops to NFTs correctly. |
| How is the approval/transfer handled for CryptoPunks collection?   |    P2    | Be aware of the specifics of the CryptoPunks collection. |
