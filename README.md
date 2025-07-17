# Talos Improvement Proposal (TIP) Process

This repository is for Talos Improvement Proposals (TIPs). The TIP process is the primary mechanism for proposing new features, for collecting community input on an issue, and for documenting the design decisions that have gone into Talos.

## How to Submit a TIP

1.  **Fork this repository.**
2.  **Copy `TIP-template.md` to `tip-xxxx.md`**, where `xxxx` is the TIP number you are reserving.
3.  **Fill in the TIP.** Put care into the details: TIPs that do not present convincing motivation, demonstrate understanding of the design's impact, and document security considerations may be rejected outright.
4.  **Submit a Pull Request.**

## TIP Process

The TIP process is outlined in [TIP-0001](./TIP-0001.md). The general flow is as follows:

1.  **Idea:** Start a discussion on x.com to get feedback on your idea.
2.  **Draft:** If the idea is well-received, create a new TIP using the template and submit it as a pull request.
3.  **Review:** The community will review and provide feedback on your TIP.
4.  **Approval:** Talos will review the TIP, taking into account delegate advice, and make a decision.
5.  **Veto:** If approved by Talos, the delegates have a 7-day window to veto the proposal with a 2/3 supermajority vote.

## TIP Types

There are three types of TIPs:

- A **Standards Track TIP** describes any change that affects most or all Talos implementations.
- An **Informational TIP** provides general guidelines or information to the Talos community.
- A **Process TIP** describes a process surrounding Talos, or proposes a change to a process.

For more details on the TIP process, please see [TIP-0001](./TIP-0001.md).
