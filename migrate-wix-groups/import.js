/**
 * @fileoverview
 * This script interacts with the Wix API to manage group memberships.
 * It performs the following tasks:
 * 1. Extracts API Key and Site ID from environment variables.
 * 2. Initializes a Wix client with authentication.
 * 3. Finds a group by title.
 * 4. Finds a member by email.
 * 5. Adds a member to a specified group.
 *
 * Usage:
 *   node script.js <groupTitle> <memberEmail>
 *
 * Arguments:
 * - `<groupTitle>`: The title of the group to which the member will be added. It uses the condition "starts with" to find the group.
 * - `<memberEmail>`: The email of the member to be added to the group. It needs to be exactly the same including case.
 *
 * Error Handling:
 * - The script checks for missing environment variables and handles errors
 *   during API calls. It exits with an error code if the group or member is
 *   not found or if there are issues with the API requests.
 *
 * Dependencies:
 * - @wix/sdk: For creating a Wix API client.
 * - @wix/groups: For interacting with group-related endpoints.
 * - @wix/members: For querying and managing members.
 *
 * @version 1.0
 * @author Maho Pacheco - SOMOS.tech
 * @date Sept 2024
 */
import { createClient, ApiKeyStrategy } from "@wix/sdk";
import { groups, members } from "@wix/groups";
import { members as membersQuery } from "@wix/members";

// Extract API Key and Site ID from environment variables
const API_KEY = process.env.WIX_API_KEY;
const SITE_ID = process.env.WIX_SITE_ID;

if (!API_KEY || !SITE_ID) {
  console.error('API_KEY and SITE_ID must be set in environment variables.');
  process.exit(1);
}

const wixClient = createClient({
  modules: { groups, members, membersQuery },
  auth: ApiKeyStrategy({
    apiKey: API_KEY,
    siteId: SITE_ID,
  })
});

async function findGroup(name) {
  try {
    const items = await wixClient.groups.queryGroups().startsWith("title", name).find();
    return items;
  } catch (error) {
    console.error('Error finding group:', error);
    throw error;
  }
}

async function addGroupMembers(groupId, memberIds) {
  try {
    const response = await wixClient.members.addGroupMembers(groupId, memberIds);
    return response;
  } catch (error) {
    console.error('Error adding group members:', error);
    throw error;
  }
}

async function findMember(email) {
  try {
    const items = await wixClient.membersQuery.queryMembers().eq("loginEmail", email).find();
    return items;
  } catch (error) {
    console.error('Error finding member:', error);
    throw error;
  }
}

// Validate and process CLI arguments
if (process.argv.length < 4) {
  console.error('Usage: node script.js <groupTitle> <memberEmail>');
  process.exit(1);
}

const groupTitle = process.argv[2];
const memberEmail = process.argv[3];

(async () => {
  try {
    const resultGroup = await findGroup(groupTitle);

    if (resultGroup.totalCount === 0) {
      console.error(`Group with title ${groupTitle} not found`);
      process.exit(1);
    }

    const groupId = resultGroup.items[0]._id;

    const membersResult = await findMember(memberEmail);
    if (membersResult._totalCount === 0) {
      console.error(`Member with email ${memberEmail} not found`);
      process.exit(1);
    }

    const memberId = membersResult.items[0]._id;

    console.log(`Adding member ${memberId} (${memberEmail}) to group ${groupId} (${groupTitle})`);

    await addGroupMembers(groupId, [memberId]);

    console.log('Member added successfully.');
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
})();
