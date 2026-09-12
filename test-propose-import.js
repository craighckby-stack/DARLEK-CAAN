/**
 * @file test-propose-import.js
 * @description Test utility for submitting an evolution proposal to the local API endpoint.
 */

const EVOLUTION_PROPOSAL_ENDPOINT = 'http://localhost:3000/api/evolution/propose';

const proposalPayload = {
  fileContent: "import { something } from 'somewhere';\nexport const hello = 'world';",
  filePath: 'src/test.ts',
  apiKeys: {},
  sessionId: 'test-session',
};

async function submitEvolutionProposal() {
  try {
    const response = await fetch(EVOLUTION_PROPOSAL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(proposalPayload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Proposed Code:', data.proposedCode);
  } catch (error) {
    console.error('Failed to submit evolution proposal:', error);
  }
}

submitEvolutionProposal();