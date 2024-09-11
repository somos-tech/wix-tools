import { createClient, ApiKeyStrategy } from "@wix/sdk";
import { groups, members } from "@wix/groups";

/**
 * This script lists all groups and their members from a Wix site.
 * It requires the API Key and Site ID to be set in environment variables.
 * 
 * Usage:
 *   Set the environment variables WIX_API_KEY and WIX_SITE_ID.
 *   Execute the script using Node.js.
 * 
 * Example:
 *   WIX_API_KEY=your_api_key WIX_SITE_ID=your_site_id node script.js
 */

// Extract API Key and Site ID from environment variables
const API_KEY = process.env.WIX_API_KEY;
const SITE_ID = process.env.WIX_SITE_ID;

if (!API_KEY || !SITE_ID) {
  console.error('API_KEY and SITE_ID must be set in environment variables.');
  console.error('Usage: WIX_API_KEY=your_api_key WIX_SITE_ID=your_site_id node script.js');
  process.exit(1);
}

const wixClient = createClient({
  modules: { groups, members },
  auth: ApiKeyStrategy({
    apiKey: API_KEY,
    siteId: SITE_ID,
  })
});

async function listGroups() {
  const response = await wixClient.groups.listGroups({ limit: 100 });

  var groups = response.groups;

  // Print to the console name, membersCount, memberTitle
  groups.forEach(async (group) => {
    console.log(
      `${group.name},${group._id},${group.membersCount},${group.memberTitle}`
    );
    await listMembers(group._id, { limit: 100, offset: 0 });
  });
}

async function listMembers(groupId, options) {
  const response = await wixClient.members.listGroupMembers(groupId, options);

  var members = response.members;

  // Print to the console email, firstName, lastName
  members.forEach((member) => {
    console.log(
      `${member.memberId},${groupId}`
    );
  });

  // If members is 100 then repeat
  if (members.length >= options.limit) {
    await listMembers(groupId, { limit: options.limit, offset: options.offset + options.limit });
  }
}

listGroups();
