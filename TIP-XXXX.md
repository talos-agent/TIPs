---
tip: XXXX
title: OHM Strategy Framework for TALOS Treasury
author: Relwyn
status: Draft
type: Standards Track
created: 2025-08-23
---

## Abstract

This TIP proposes a strategic framework for TALOS to deploy OHM across a range of risk profiles. The goal is not to prescribe a single strategy, but to outline low, medium, and high-risk approaches TALOS can draw from. By incorporating Olympus’ lending primitive (Coolers) and third-party vaults (e.g., Peapod Metavaults, Uniswap AMMs, ERC4626 Vaults), TALOS can maintain OHM exposure, access stablecoin liquidity, and layer on directional strategies while protecting core treasury value.

## Motivation

TALOS aims to be an agentic, self-sustaining system. Treasury strategy is central to this design, and OHM offers a uniquely aligned building block:

- **Reserve-backed**: Each OHM is transparently backed by reserve assets (as of August 2025, $11.73 per OHM).  
- **Liquid**: Olympus maintains deep Protocol-Owned Liquidity across chains, including Arbitrum.  
- **Yield-bearing**: OHM can generate sustainable returns in lending markets and acts as a strong liquidity pair when placed into an AMM with a well-correlated asset.  
- **Optionality**: Coolers provide stablecoin liquidity against OHM collateral at low cost, preserving exposure while funding directional bets.  

This TIP introduces a tiered framework for how TALOS might utilize OHM, balancing risk and opportunity.

## Specification

### Low Risk

- **Metavaults / Lending**: TALOS deposits OHM into a Peapod Finance Metavault on Ethereum to earn ~25% vAPR (current TVL: ~$165k, ~96% utilization). Returns are denominated in OHM, providing compounding exposure.  
- **Coolers for Liquidity**: If operational liquidity is needed, TALOS can pull OHM from vaults, wrap to gOHM, and take a Cooler loan at 50% LTV, 0.5% APR. This provides USDS liquidity while preserving OHM upside.  

This approach positions OHM as collateral — a value layer rather than a speculation layer.

### Medium Risk

- **Liquidity Provision**: TALOS allocates OHM to Uniswap v3 pools (e.g., OHM/USDC or OHM/wETH) or considers forming a Peapod LP vault (Peapods is another TALOS-whitelisted protocol). Current ranges:  
  - OHM/USDC v3 (0.3% fee): ~8.6% vAPR, TVL ~$269k.  
  - gOHM/wETH v3 (0.3% fee): ~10.4% vAPR, TVL ~$92k.  
  - Peapod OHM vaults: ~26–35% vAPR, TVLs $200k–$3m.  
- **Directional Yield**: OHM positions can be paired with ETH or BTC to express directional views while generating fee income.  

### High Risk

- **Leveraged OHM**: TALOS enters looped OHM strategies (e.g., hOHM vaults). Current metrics show effective exposures >2x OHM with ROE ~41.6% vAPR on ~$8.8m TVL.  
- **Speculative Allocation**: Using Cooler loans, TALOS can finance directional bets (long ETH, long BTC, etc.) while retaining OHM as protected collateral.  
- **Leveraged Volatility Farming**: TALOS may engage in opening and closing leveraged directional positions on token pairs, capturing volatility while assuming the risks inherent to leverage and amplified downside exposure.  

High-risk strategies carry volatility and liquidation risk if markets dislocate.

## Rationale

- **Flexibility**: A tiered structure allows TALOS to align strategy with treasury conditions and market outlook.  
- **Preservation + Speculation**: Core OHM holdings remain a reserve layer; speculative positions are layered on via liquidity or leverage.  
- **Optionality**: Coolers provide stablecoin liquidity at minimal cost, giving TALOS flexibility without forced selling.  

## Security Considerations

- **Protocol Risk**: Reliance on Olympus contracts, Peapod vaults, or third-party AMMs requires diligence.  
- **Market Risk**: Impermanent loss, leverage drawdowns, or OHM trading below backing are risks to manage.  
- **Liquidity Risk**: Vault caps (e.g., 96% TVL utilization) may limit scaling; returns may dilute as capacity expands.  

## Copyright Waiver

This TIP is in the public domain.
