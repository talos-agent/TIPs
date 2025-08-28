---
tip: <to be assigned>
title: <TIP Title>
author: <list of authors' real names and email addrs>
status: <Draft | Active | Accepted | Rejected | Withdrawn>
type: <Standards Track | Informational | Process>
created: <date created on, in ISO 8601 (yyyy-mm-dd) format>
---

## Abstract

A short (~200 word) description of the technical issue being addressed.

## Motivation

The motivation is critical for TIPs that want to change the Talos protocol. It should clearly explain why the existing protocol specification is inadequate to address the problem that the TIP solves. TIP submissions without sufficient motivation may be rejected outright.

## Specification

The technical specification should describe the syntax and semantics of any new feature. The specification should be detailed enough to allow competing, interoperable implementations for any of the current Talos platforms.

## Rationale

The rationale fleshes out the specification by describing what motivated the design and why particular design decisions were made. It should describe alternate designs that were considered and related work, e.g. how the feature is supported in other systems. The rationale may also provide evidence of consensus within the community, and should discuss important objections or concerns raised during discussion.

## Security Considerations

All TIPs must contain a section that discusses the security implications/considerations relevant to the proposed change. Include information that might be important for security discussions, surfaces risks and can be used throughout the life cycle of the proposal. E.g. include security-relevant design decisions, concerns, important discussions, implementation-specific guidance and pitfalls, an outline of threats and risks and how they are being addressed. TIP submissions missing the "Security Considerations" section will be rejected. A TIP cannot proceed to status "Accepted" without a Security Considerations discussion deemed sufficient by the reviewers.

## Security Checklist

This checklist is not exhaustive. It is a tool to help TIP authors and reviewers think about security. TIP authors are encouraged to consult other resources and experts.

### Attacker's Mindset

#### Denial-Of-Service(DOS) Attack
- [ ] Is the withdrawal pattern followed to prevent denial of service?
- [ ] Is there a minimum transaction amount enforced?
- [ ] How does the protocol handle tokens with blacklisting functionality?
- [ ] Can forcing the protocol to process a queue lead to DOS?
- [ ] What happens with low decimal tokens that might cause DOS?
- [ ] Does the protocol handle external contract interactions safely?

#### Donation Attack
- [ ] Does the protocol rely on `balance` or `balanceOf` instead of internal accounting?

#### Front-running Attack
- [ ] Are "get-or-create" patterns protected against front-running attacks?
- [ ] Are two-transaction actions designed to be safe from frontrunning?
- [ ] Can users maliciously cause others' transactions to revert by preempting with dust?
- [ ] Is the protocol using a properly user-bound commit-reveal scheme?

#### Griefing Attack
- [ ] Is there an external function that relies on states that can be changed by others?
- [ ] Can the contract operations be manipulated with precise gas limit specifications?

#### Miner Attack
- [ ] Is block.timestamp used for time-sensitive operations?
- [ ] Is the contract using block properties like timestamp or difficulty for randomness generation?
- [ ] Is contract logic sensitive to transaction ordering?

#### Price Manipulation Attack
- [ ] Is the price calculated by the ratio of token balances?
- [ ] Is the price calculated from DEX liquidity pool spot prices?

#### Reentrancy Attack
- [ ] Is there a view function that can return a stale value during interactions?
- [ ] Is there any state change after interaction to an external contract?

#### Replay Attack
- [ ] Are there protections against replay attacks for failed transactions?
- [ ] Is there protection against replaying signatures on different chains?

#### Rug Pull
- [ ] Can the admin of the protocol pull assets from the protocol?

#### Sandwich Attack
- [ ] Does the protocol have an explicit slippage protection on user interactions?

#### Sybil Attack
- [ ] Is there a mechanism depending on the number of users?

### Basics

#### Access Control
- [ ] Did you clarify all the actors and their allowed interactions in the protocol?
- [ ] Are there functions lacking proper access controls?
- [ ] Do certain addresses require whitelisting?
- [ ] Does the protocol allow transfer of privileges?
- [ ] What happens during the transfer of privileges?
- [ ] Does the contract inherit others?
- [ ] Does the contract use `tx.origin` in validation?

#### Array / Loop
- [ ] What happens on the first and the last cycle of the iteration?
- [ ] How does the protocol remove an item from an array?
- [ ] Does any function get an index of an array as an argument?
- [ ] Is the summing of variables done accurately compared to separate calculations?
- [ ] Is it fine to have duplicate items in the array?
- [ ] Is there any issue with the first and the last iteration?
- [ ] Is there possibility of iteration of a huge array?
- [ ] Is there a potential for a Denial-of-Service (DoS) attack in the loop?
- [ ] Is `msg.value` used within a loop?
- [ ] Is there a loop to handle batch fund transfer?
- [ ] Is there a break or continue inside a loop?

#### Block Reorganization
- [ ] Does the protocol implement a factory pattern using the CREATE opcode?

#### Event
- [ ] Does the protocol emit events on important state changes?

#### Function
- [ ] Are the inputs validated?
- [ ] Are the outputs validated?
- [ ] Can the function be front-run?
- [ ] Are the code comments coherent with the implementation?
- [ ] Can edge case inputs (0, max) result in unexpected behavior?
- [ ] Does the function allow arbitrary user input?
- [ ] Should it be `external`/`public`?
- [ ] Does this function need to be called by only EOA or only contracts?
- [ ] Does this function need to be restricted for specific callers?

#### Inheritance
- [ ] Is it necessary to limit visibility of parent contract's public functions?
- [ ] Were all necessary functions implemented to fulfill inheritance purpose?
- [ ] Has the contract implemented an interface?
- [ ] Does the inheritance order matter?

#### Initialization
- [ ] Are important state variables initialized properly?
- [ ] Has the contract inherited OpenZeppelin's Initializable?
- [ ] Does the contract have a separate initializer function other than a constructor?

#### Map
- [ ] Is there need to delete the existing item from a map?

#### Math
- [ ] Is the mathematical calculation accurate?
- [ ] Is there any loss of precision in time calculations?
- [ ] Are you aware that expressions like `1 day` are cast to `uint24`, potentially causing overflows?
- [ ] Is there any case where dividing is done before multiplication?
- [ ] Does the rounding direction matter?
- [ ] Is there a possibility of division by zero?
- [ ] Even in versions like `>0.8.0`, have you ensured variables won't underflow or overflow leading to reverts?
- [ ] Are you aware that assigning a negative value to an unsigned integer causes a revert?
- [ ] Have you properly reviewed all usages of `unchecked{}`?
- [ ] In comparisons using < or >, should you instead be using ≤ or ≥?
- [ ] Have you taken into consideration mathematical operations in inline assembly?
- [ ] What happens for the minimum/maximum values included in the calculation?

#### Payment
- [ ] Is it possible for the receiver to revert?
- [ ] Does the function gets the payment amount as a parameter?
- [ ] Are there vulnerabilities related to force-feeding?
- [ ] What is the minimum deposit/withdrawal amount?
- [ ] How is the withdrawal handled?
- [ ] Is `transfer()` or `send()` used for sending ETH?
- [ ] Is it possible for native ETH to be locked in the contract?

#### Proxy/Upgradable
- [ ] Is there a constructor in the proxied contract?
- [ ] Is the `initializer` modifier applied to the `initialization()` function?
- [ ] Is the upgradable version used for initialization?
- [ ] Is the `authorizeUpgrade()` function properly secured in a UUPS setup?
- [ ] Is the contract initialized?
- [ ] Are `selfdestruct` and `delegatecall` used within the implementation contracts?
- [ ] Are values in immutable variables preserved between upgrades?
- [ ] Has the contract inherited the correct branch of OpenZeppelin library?
- [ ] Could an upgrade of the contract result in storage collision?
- [ ] Are the order and types of storage variables consistent between upgrades?

#### Type
- [ ] Is there a forced type casting?
- [ ] Does the protocol use time units like `days`?

#### Version Issues
- [ ] EIP-4758: Does the contract use `selfdestruct()`?
- [ ] Does the contract use `ERC2771Context`? (version >=4.0.0 <4.9.3)
- [ ] Does the contract use OpenZeppelin's GovernorCompatibilityBravo? (version >=4.3.0 <4.8.3)
- [ ] Does the contract use OpenZeppelin's ECDSA.recover or ECDSA.tryRecover? (version <4.7.3)
- [ ] Does the contract use OpenZeppelin's ERC777? (version <3.4.0-rc.0)
- [ ] Does the contract use OpenZeppelin's `MerkleProof`? (version >=4.7.0 <4.9.2)
- [ ] Does the contract use OpenZeppelin's Governor or GovernorCompatibilityBravo? (version >=4.3.0 <4.9.1)
- [ ] Does the contract use OpenZeppelin's TransparentUpgradeableProxy? (version >=3.2.0 <4.8.3)
- [ ] Does the contract use OpenZeppelin's ERC721Consecutive?(version >=4.8.0 <4.8.2)
- [ ] Does the contract use OpenZeppelin's ERC165Checker or ERC165CheckerUpgradeable? (version >=2.3.0 <4.7.2)
- [ ] Does the contract use OpenZeppelin's LibArbitrumL2 or CrossChainEnabledArbitrumL2? (version >=4.6.0 <4.7.2)
- [ ] Does the contract use OpenZeppelin's GovernorVotesQuorumFraction? (version >=4.3.0 <4.7.2)
- [ ] Does the contract use OpenZeppelin's SignatureChecker? (version >=4.1.0 <4.7.1)
- [ ] Does the contract use OpenZeppelin's ERC165Checker? (version >=4.0.0 <4.7.1)
- [ ] Does the contract use OpenZeppelin's GovernorCompatibilityBravo? (version >=4.3.0 <4.4.2)
- [ ] Does the contract use OpenZeppelin's Initializable? (version >=3.2.0 <4.4.1)
- [ ] Does the contract use OpenZeppelin's ERC1155? (version >=4.2.0 <4.3.3)
- [ ] Does the contract use OpenZeppelin's UUPSUpgradeable? (version >=4.1.0 <4.3.2)
- [ ] Does the contract use OpenZeppelin's TimelockController? (version >=4.0.0-beta.0 <4.3.1\\n<3.4.2)
- [ ] Does the contract encode storage structs or arrays with types under 32 bytes directly using experimental ABIEncoderV2? (version 0.5.0~0.5.6)
- [ ] Are there any instances where empty strings are directly passed to function calls? (version ~0.4.11)
- [ ] Does the optimizer replace specific constants with alternative computations? (version ~0.4.10)
- [ ] Does the contract use `abi.encodePacked`, especially in hash generation? (version >= 0.8.17)
- [ ] BUILD: Is the contract optimized using sequences containing FullInliner with non-expression-split code? (version 0.6.7~0.8.20)
- [ ] Are there any functions that conditionally terminate inside an inline assembly? (version 0.8.13~0.8.16)
- [ ] Are tuples containing a statically-sized calldata array at the end being ABI-encoded? (version 0.5.8~0.8.15)
- [ ] Does the contract have functions that copy `bytes` arrays from memory or calldata directly to storage? (version 0.0.1~0.8.14)
- [ ] Is there a function with multiple inline assembly blocks? (version 0.8.13~0.8.14)
- [ ] Is a nested array being ABI-encoded or passed directly to an external function? (version 0.5.8~0.8.13)
- [ ] Is `abi.encodeCall` used together with fixed-length bytes literals? (version 0.8.11~0.8.12)
- [ ] Is there any user defined types based on types shorter than 32 bytes? (version =0.8.8)
- [ ] Is there an immutable variable of signed integer type shorter than 256 bits? (version 0.6.5~0.8.8)
- [ ] Is there any use of `abi.encode` on memory with multi-dimensional array or structs? (version 0.4.16~0.8.3)
- [ ] Is there an inline assembly block with `keccak256` inside? (version ~0.8.2)
- [ ] Is there a copy of an empty `bytes` or `string` from `memory` or `calldata` to `storage`? (version ~0.7.3)
- [ ] Is there a dynamically-sized storage-array with types of size at most 16 bytes? (version ~0.7.2)
- [ ] Does the library use contract types in events? (version 0.5.0~0.5.7)
- [ ] Does the contract use internal library functions with calldata parameters via `using for`? (version =0.6.9)
- [ ] Are string literals with double backslashes passed directly to external or encoding functions with ABIEncoderV2 enabled? (version 0.5.14~0.6.7)
- [ ] Does the contract access slices of dynamic arrays, especially multi-dimensional ones? (version 0.6.0~0.6.7)
- [ ] Is there a contract with creation code, no constructor, but a base with a constructor that accepts non-zero values? (version 0.4.5~0.6.7)
- [ ] Does the contract create extremely large memory arrays? (version 0.2.0~0.6.4)
- [ ] Does the contract's inline assembly with Yul optimizer use assignments inside for loops combined with continue or break? (version =0.6.0)
- [ ] Does the contract allow private methods to be overridden by inheriting contracts? (version 0.3.0~0.5.16)
- [ ] Is there any Yul's continue or break statement inside the loop?? (version 0.5.8~0.5.15)
- [ ] Are both experimental ABIEncoderV2 and Yul optimizer activated? (version =0.5.14)
- [ ] Does the contract read from calldata structs with dynamic yet statically-sized members? (version 0.5.6~0.5.10)
- [ ] Does the contract assign arrays of signed integers to differently typed storage arrays? (version 0.4.7~0.5.9)
- [ ] Does the contract directly encode storage arrays with structs or static arrays in external calls or abi.encode*? (version 0.4.16~0.5.9)
- [ ] Does the contract's constructor accept structs or arrays with dynamic arrays? (version 0.4.16~0.5.8)
- [ ] Are uninitialized internal function pointers created in the constructor being called? (version 0.5.0~0.5.7)
- [ ] Are uninitialized internal function pointers created in the constructor being called? (version 0.4.5~0.4.25)
- [ ] Does the library use contract types in events? (version 0.3.0~0.4.25)
- [ ] Does the contract encode storage structs or arrays with types under 32 bytes directly using experimental ABIEncoderV2? (version 0.4.19~0.4.25)
- [ ] Does the contract's optimizer handle byte opcodes with a second argument of 31 or an equivalent constant expression? (version 0.5.5~0.5.6)
- [ ] Are there double bitwise shifts with large constants that might sum up to overflow 256 bits? (version =0.5.5)
- [ ] Is the ** operator used with an exponent type shorter than 256 bits? (version ~0.4.24)
- [ ] Are structs used in the logged events? (version 0.4.17~0.4.24)
- [ ] Are functions returning multi-dimensional fixed-size arrays called? (version 0.1.4~0.4.21)
- [ ] Does the contract use both new-style and old-style constructors simultaneously? (version =0.4.22)
- [ ] Is there a function name crafted to potentially override the fallback function execution? (version ~0.4.17)
- [ ] Is the low-level .delegatecall() used without checking the actual execution outcome? (version 0.3.0~0.4.14)
- [ ] Is the ecrecover() function used without validating its input? (version ~0.4.13)
- [ ] Is the `.selector` member accessed on complex expressions? (version 0.6.2~0.8.20)
- [ ] Is there any inconsistency (`memory` vs `calldata`) in the param type during inheritance? (version 0.6.9~0.8.13)
- [ ] Are there any functions with the same name and parameter type inside the same contract? (version =0.7.1)
- [ ] Does the contract use tuple assignments with multi-stack-slot components, like nested tuples or dynamic calldata references? (version 0.1.6~0.6.5)

### Centralization Risk
- [ ] What happens to the user accounting in special conditions?
- [ ] Is there a pause mechanism?
- [ ] Is there a functionality for the admin to withdraw from the protocol?
- [ ] Can the admin change critical protocol property immediately?
- [ ] Is there any admin setter function missing events?
- [ ] How is the ownership/privilege transferred??
- [ ] Is there a proper validation in privileged setter functions?

### Defi

#### AMM/Swap
- [ ] Is hardcoded slippage used?
- [ ] Is there a deadline protection?
- [ ] Is there a validation check for protocol reserves?
- [ ] Does the AMM utilize forked code?
- [ ] Are there rounding issues in product constant formulas?
- [ ] Can arbitrary calls be made from user input?
- [ ] Is there a mechanism in place to protect against excessive slippage?
- [ ] Does the AMM properly handle tokens of varying decimal configurations and token types?
- [ ] Does the AMM support the fee-on-transfer tokens?
- [ ] Does the AMM support the rebasing tokens?
- [ ] Does the protocol calculate `minAmountOut` before a token swap?
- [ ] Does the integrating contract verify the caller address in its callback functions?
- [ ] Is the slippage calculated on-chain?
- [ ] Is the slippage parameter enforced at the last step before transferring funds to users?

#### FlashLoan
- [ ] Is withdraw disabled in the same block to prevent flashloan attacks?
- [ ] Can ERC4626 be manipulated through flashloans?

#### General
- [ ] Can the protocol handle ERC20 tokens with decimals other than 18?
- [ ] Are there unexpected rewards accruing for user deposited assets?
- [ ] Could direct transfers of funds introduce vulnerabilities?
- [ ] Could the initial deposit introduce any issues?
- [ ] Are the protocol token pegged to any other asset?
- [ ] Does the protocol revert on maximum approval to prevent over-allowance?
- [ ] What would happen if only 1 wei remains in the pool?
- [ ] Is it possible to withdraw in the same transaction of deposit?
- [ ] Does the protocol aim to support ALL kinds of ERC20 tokens?

#### Lending
- [ ] Will the liquidation process function effectively during rapid market downturns?
- [ ] Can a position be liquidated if the loan remains unpaid or if the collateral falls below the required threshold?
- [ ] Is it possible for a user to gain undue profit from self-liquidation?
- [ ] If token transfers or collateral additions are temporarily paused, can a user still be liquidated, even if they intend to deposit more funds?
- [ ] If liquidations are temporarily suspended, what are the implications when they are resumed?
- [ ] Is it possible for users to manipulate the system by front-running and slightly increasing their collateral to prevent liquidations?
- [ ] Are all positions, regardless of size, incentivized adequately for liquidation?
- [ ] Is interest considered during Loan-to-Value (LTV) calculation?
- [ ] Can liquidation and repaying be enabled or disabled simultaneously?
- [ ] Is it possible to lend and borrow the same token within a single transaction?
- [ ] Is there a scenario where a liquidator might receive a lesser amount than anticipated?
- [ ] Is it possible for a user to be in a condition where they cannot repay their loan?

#### Liquid Staking Derivatives
- [ ] Can a malicious validator front-run setting withdrawal credentials?
- [ ] Can the exchange rate repricing update be sandwich attacked to drain ETH from the protocol?
- [ ] Can re-entrancy when ETH is sent during rewards/withdrawals or when NFTs are minted via `_safeMint` (to represent pending withdrawals) be used to drain the protocol's ETH?
- [ ] Can an arbitrary exchange rate be set when processing queued withdrawals?
- [ ] Can paused states be bypassed to perform restricted actions even when they should be paused?
- [ ] Can inter-related storage be corrupted, especially storage related to operators and validators?
- [ ] Does the protocol iterate over the entire set of operators or validators?
- [ ] If using a Proof Of Reserves Oracle, does the protocol check for stale data?
- [ ] Does unnecessary precision loss occur in deposit, withdrawal or reward calculations?

#### Oracle
- [ ] Is the Oracle using deprecated Chainlink functions?
- [ ] Is the returned price validated to be non-zero?
- [ ] Is the price update time validated?
- [ ] Is there a validation to check if the rollup sequencer is running?
- [ ] Is the Oracle's TWAP period appropriately set?
- [ ] Is the desired price feed pair supported across all deployed chains?
- [ ] Is the heartbeat of the price feed suitable for the use case?
- [ ] Are there any inconsistencies with decimal precision when using different price feeds?
- [ ] Is the price feed address hard-coded?
- [ ] What happens if oracle price updates are front-run?
- [ ] How does the system handle potential oracle reverts?
- [ ] Are the price feeds appropriate for the underlying assets?
- [ ] Is the contract vulnerable to oracle manipulation, especially using spot prices from AMMs?
- [ ] How does the system address potential inaccuracies during flash crashes?

#### Staking
- [ ] Can a user amplify another user's time lock duration by stacking tokens on their behalf?
- [ ] Can the distribution of rewards be unduly delayed or prematurely claimed?
- [ ] Are rewards up-to-date in all use-cases?

### External Call
- [ ] What are the implications if the call reenters a different function?
- [ ] Is there a multi-call?
- [ ] What are the risks associated with using delegatecall in smart contracts?
- [ ] Is the external contract call necessary?
- [ ] Has the called address been whitelisted?
- [ ] Is there suspicion when a fixed gas amount is specified?
- [ ] What happens if the call consumes all provided gas?
- [ ] Is the contract passing large data to an unknown address?
- [ ] What happens if the call returns vast data?
- [ ] Are there any delegate calls to non-library contracts?
- [ ] Is there a strict policy against delegate calls to untrusted contracts?
- [ ] Is the address's existence verified?
- [ ] Is the check-effect-interaction pattern being utilized?
- [ ] How is the msg.sender handled?

### Hash / Merkle Tree
- [ ] Is the Merkle tree vulnerable to front-running attacks?
- [ ] Does the claim method validate `msg.sender`?
- [ ] What is the result when passing a zero hash to the Merkle tree functions?
- [ ] What occurs if the same proof is duplicated within the Merkle tree?
- [ ] Are the leaves of the Merkle tree hashed with the claimable address included?

### Heuristics
- [ ] Is there any logic implemented multiple times?
- [ ] Does the contract use any nested structures?
- [ ] Is there any unexpected behavior when `src==dst` (or `caller==receiver`)?
- [ ] Is the NonReentrant modifier placed before every other modifier?
- [ ] Does the `try/catch` block account for potential gas shortages?
- [ ] Did you check the relevant EIP recommendations and security concerns?
- [ ] Are there any off-by-one errors?
- [ ] Are logical operators used correctly?
- [ ] What happens if the protocol's contracts are inputted as if they are normal actors?
- [ ] Are there rounding errors that can be amplified?
- [ ] Is there any uninitialized state?
- [ ] Can functions be invoked multiple times with identical parameters?
- [ ] Is the global state updated correctly?
- [ ] Is ETH/WETH handling implemented correctly?
- [ ] Does the protocol put any sensitive data on the blockchain?
- [ ] Are there any code asymmetries?
- [ ] Does calling a function multiple times with smaller amounts yield the same contract state as calling it once with the aggregate amount?

### Integrations

#### AAVE / Compound
- [ ] Does the protocol use cETH token?
- [ ] What happens if the utilization rate is too high, and collateral cannot be retrieved?
- [ ] What happens if the protocol is paused?
- [ ] What happens if the pool becomes deprecated?
- [ ] What happens if assets you lend/borrow are within the same eMode category?
- [ ] Do flash loans on Aave inflate the pool index?
- [ ] Does the protocol properly implement AAVE/COMP reward claims?
- [ ] On AAVE, what happens if a user reaches the maximum debt on an isolated asset?
- [ ] Does borrowing an AAVE siloed asset restrict borrowing other assets?

#### Balancer
- [ ] Does the protocol use the Balancer's flashloan?
- [ ] Does the protocol use Balancer's Oracle? (getTimeWeightedAverage)
- [ ] Does the protocol use Balancer's Boosted Pool?
- [ ] Does the protocol use Balancer vault pool liquidity status for any pricing?

#### Chainlink CCIP
- [ ] Does the receiver contract's `_ccipReceive` function properly validate the `sourceChainSelector` and `sender` address against an allowlist?
- [ ] Does the sender contract validate the `destinationChainSelector` against an allowlist before calling `ccipSend`?
- [ ] Does the receiver contract properly decode data (`any2EvmMessage.data`) ?
- [ ] Does the application logic account for the potential latency introduced by waiting for source chain finality as defined by CCIP?
- [ ] Are the correct types of token pools (e.g., `BurnMintTokenPool`, `LockReleaseTokenPool`) deployed on the source and destination chains consistent with the desired token handling mechanism?
- [ ] Is proper router address verification implemented in the ccipReceive method?
- [ ] Are extraArgs parameters hardcoded instead of mutable in cross-chain message configurations?
- [ ] Is there a proper failure handling mechanism for CCIP messages to prevent blocking after Smart Execution window expiration?

#### Chainlink VRF
- [ ] Are all parameters properly verified when Chainlink VRF is called?
- [ ] Is it guaranteed that the operator holds sufficient LINK in the subscription?
- [ ] Is a sufficiently high request confirmation number chosen considering chain re-orgs?
- [ ] Are measures in place to prevent VRF calls from being frontrun?

#### Gnosis Safe
- [ ] Do your modules execute the Guard's hooks?
- [ ] Does the `execTransactionFromModule()` function increment the nonce?

#### LayerZero
- [ ] Does the `_debitFrom` function in ONFT properly validate token ownership and transfer permissions?
- [ ] Which type of mechanism are utilized? Blocking or non-blocking?
- [ ] Is gas estimated accurately for cross-chain messages?
- [ ] Is the `_lzSend` function correctly utilized when inheriting LzApp?
- [ ] Is the `ILayerZeroUserApplicationConfig` interface correctly implemented?
- [ ] Are default contracts used?
- [ ] Is the correct number of confirmations chosen for the chain?

#### LSD cbETH
- [ ] How is the control over the `cbETH`/`ETH` rate determined? Are there specific addresses with this capability due to the `onlyOracle` modifier?
- [ ] How does the system handle potential decreases in the `cbETH`/`ETH` rate?

#### LSD rETH
- [ ] Does the application account for potential penalties or slashes?
- [ ] How does the system manage rewards accrued from staking?
- [ ] Does the application handle potential reverts in the `burn()` function when there's insufficient ether in the `RocketDepositPool`?
- [ ] What measures are in place to counter-act potential consensus attacks on RPL nodes?
- [ ] How does the system handle the conversion between `ETH` and `rETH`?

#### LSD sfrxETH
- [ ] How does the system handle potential detachment of `sfrxETH` from `frxETH` during reward transfers?
- [ ] Is the stability of the `sfrxETH`/`ETH` rate guaranteed or can it decrease in the future?

#### LSD stETH
- [ ] Is the application aware that `stETH` is a rebasing token?
- [ ] Are you aware of the overhead when withdrawing `stETH`/`wstETH`?
- [ ] Does the application handle conversions between `stETH` and `wstETH` correctly?

#### Uniswap
- [ ] Is the slippage calculated on-chain?
- [ ] Are there refunds after swaps?
- [ ] Is the order of `token0` and `token1` consistent across chains?
- [ ] Are the pools that are being interacted with whitelisted?
- [ ] Is there a reliance on pool reserves?
- [ ] Is `pool.swap()` directly used?
- [ ] Is `unchecked` used properly with Uniswap's math libraries?
- [ ] Is the slippage parameter enforced at the last step before transferring funds to users?
- [ ] Is `pool.slot0` being used to calculate sensitive information like current price and exchange rates?
- [ ] Is a hard-coded fee tier parameter being used?

### Low Level
- [ ] Is there validation on the size of the input data?
- [ ] What happens if there is no matching function signature?
- [ ] Is it checked if the target address of a call has the code?
- [ ] Is there a check on the return data size when calling precompiled code?
- [ ] Is there a non-zero check for the denominator?

### Multi-chain/Cross-chain
- [ ] Are there assumption of consistency in the `block.number` or `block.timestamp` across chains?
- [ ] Has the protocol been checked for the target chain differences?
- [ ] Are the EVM opcodes and operations used by the protocol compatible across all targeted chains?
- [ ] Does the expected behavior of `tx.origin` and `msg.sender` remain consistent across all deployment chains?
- [ ] Is there any possibility of exploiting low gas fees to execute many transactions?
- [ ] Is there consistency in ERC20 decimals across chains?
- [ ] Have contract upgradability implications been evaluated on different chains?
- [ ] Have cross-chain messaging implementations been thoroughly reviewed for permissions and functionality?
- [ ] Is there a whitelist of compatible chains?
- [ ] Have contracts been checked for compatibility when deployed to the zkSync Era?
- [ ] Is block production consistency ensured?
- [ ] Is `PUSH0` opcode supported for Solidity version `>=0.8.20`?
- [ ] Are there any attributes attached to the bridged assets?

### Signature
- [ ] Are signatures guarded against replay attacks?
- [ ] Are signatures protected against malleability issues?
- [ ] Does the returned public key from the signature verification match the expected public key?
- [ ] Is the signature originating from the appropriate entity?
- [ ] If the signature has a deadline, is it still valid?

### Timelock
- [ ] Are timelocks implemented for important changes?

### Token

#### Fungible : ERC20
- [ ] Are safe transfer functions used throughout the contract?
- [ ] Is there potential for a race condition for approvals?
- [ ] Could a difference in decimals between ERC20 tokens cause issues?
- [ ] Does the token implement any form of address whitelisting, blacklisting, or checks?
- [ ] Could the use of multiple addresses for a single token lead to complications?
- [ ] Does the token charge fee on transfer?
- [ ] Can the token be ERC777?
- [ ] Does the protocol use Solmate's `ERC20.safeTransferLib`?
- [ ] Is there a flash-mint functionality?
- [ ] What happens on zero amount transfer?
- [ ] Is the token an ERC2612 implementation?
- [ ] Can the token be sent to any address?
- [ ] Is there a direct approval to a non-zero value?
- [ ] Is there a max approval used?
- [ ] Can the token be paused?
- [ ] Is the decrease allowance feature of transferFrom() handled correctly when the sender is the caller?

#### Non-fungible : ERC721/1155
- [ ] How are the minting and transfer implemented?
- [ ] Is the contract safe from reentrancy attack?
- [ ] Is the OpenZeppelin implementation of ERC721 and ERC1155 safeguarded against reentrancy attacks, especially in the `safeTransferFrom` functions?
- [ ] Is it possible to steal NFT abusing his approval?
- [ ] Does the ERC721/1155 contract correctly implement supportsInterface?
- [ ] Can the contract support both ERC721 and ERC1155 standards?
- [ ] What happens to the airdrops that are engaged to specific NFT?
- [ ] How is the approval/transfer handled for CryptoPunks collection?

## Implementation

The implementations must be completed before any TIP is given status "Accepted", but it need not be completed before the TIP is accepted as a draft. While there is merit to the approach of reaching consensus on the specification and rationale before writing code, the principle of "rough consensus and running code" is still useful when it comes to resolving many discussions of API details.
