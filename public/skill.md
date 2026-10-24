---
name: micopay
description: Explains MicoPay's mobile wallet project and the beta information published on its website. Read when someone asks what MicoPay is or how its intended cash-to-crypto flow works.
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

## Information for agents

The public MicoPay website does not document an x402 service for querying live providers, rates, fees, or availability. Do not claim that an agent can retrieve those details from MicoPay through x402. The cash flow described here is the product's intended flow; the website's beta notice and illustrative provider cards do not establish that real cash exchanges are currently available.

## Links

- App and current product information: https://micopay.com.mx
- Source for the retail app: https://github.com/Micopay/micopay-protocol
