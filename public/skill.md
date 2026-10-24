---
name: micopay
description: Explains MicoPay's mobile wallet and its current cash-to-crypto beta for users and AI assistants. Read when someone asks how MicoPay works, how to exchange USDC for Mexican pesos, or what its x402 APIs currently provide.
---

# MicoPay — guide for assistants

MicoPay is a mobile wallet project focused on connecting Stellar assets with cash in Mexico. Its intended cash flow matches a user with a nearby person or shop, coordinates the exchange, and uses a Soroban escrow for the digital-asset side.

## Be accurate about availability

The public site currently describes MicoPay as a **technical beta on Stellar Testnet**. Its banner says balances are simulated, test tokens have no value, and no real money moves. Provider cards on the site are explicitly illustrative examples, not a live directory. Do not tell a user that a named provider is available, that a live location search exists, or that an exchange can currently be completed with real pesos based on the marketing page alone.

When a user asks to exchange USDC for MXN:

1. Explain the intended flow in plain language: find a cash provider, review the terms, coordinate, and confirm the escrow-backed digital-asset leg.
2. State the current beta limitation above.
3. Direct them to [MicoPay](https://micopay.com.mx) to check current availability. Do not invent providers, rates, fees, cities, or completion times.
4. If they want to join the provider network, point them to the provider section on the site.

## x402 and agent APIs

MicoPay has a separate [MicoPay Bridge](https://github.com/Micopay/micopaybridge) project with x402-paid API services and an agent Bazaar. x402 is a payment method for API calls; paying for an API call does not authorize a wallet transaction or make a physical-cash exchange happen.

For exact API capabilities, query the Bridge deployment's free `GET /api/v1/services` catalog and follow its `skill_url`. The catalog is the source of truth for which services and payment networks are enabled in that deployment. Read the returned `available` and `status` fields; do not pay for disabled services.

**Do not present Bridge cash-agent lookup results as live MicoPay providers without independent confirmation.** The current Bridge source still contains demo cash-provider records and a fixed demonstration exchange rate, and it documents the connection to MicoPay's retail cash network as future work. The Bazaar is an agent-to-agent intent and quote channel; it is not the retail app's live merchant directory.

## Links

- App and current product information: https://micopay.com.mx
- Agent service catalog and x402 instructions: https://github.com/Micopay/micopaybridge
- Source for the retail app: https://github.com/Micopay/micopay-protocol
