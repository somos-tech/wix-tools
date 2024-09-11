# Wix Membership Migration Scripts

This project contains two scripts designed to help you migrate user memberships between Wix sites. Whether you're moving from Wix to Wix Studio or between any two Wix sites, these scripts can simplify the process.

## Scripts

### 1. Export Groups and Members

**Purpose:** This script exports groups and their associated members from a Wix site.

**Usage:**
```bash
WIX_API_KEY=your_api_key WIX_SITE_ID=your_site_id node export.js
```

**Parameters:**
- `WIX_API_KEY`: Your Wix API key for authentication.
- `WIX_SITE_ID`: The ID of your Wix site from which to export data.

**Example:**
```bash
WIX_API_KEY=abcdef123456 WIX_SITE_ID=1234567890abcdef node export.js
```

### 2. Import Memberships

**Purpose:** This script imports memberships into a Wix site. It uses the data exported from the export script.

**Usage:**
```bash
node import.js <groupTitle> <memberEmail>
```

**Parameters:**
- `<groupTitle>`: The title of the group to which members will be added.
- `<memberEmail>`: The email address of the member to be added.

**Example:**
```bash
node import.js "Admins" "john.doe@example.com"
```

## Getting Started

To use these scripts, you'll need to:

1. **Obtain Your Wix API Key**: You can get this from your Wix account settings.
2. **Find Your Wix Site ID**: This can be found in your Wix site's settings or dashboard.

### Installation

1. Clone this repository:
    ```bash
    git clone https://github.com/somos-tech/wix-tools.git
    ```

2. Navigate to the project directory:
    ```bash
    cd wix-membership-migration
    ```

3. Install necessary dependencies (if any):
    ```bash
    npm install
    ```

## About

This project is created by [SOMOS.tech](https://www.somos.tech/), a non-profit organization dedicated to to create a community that provides networking opportunities, resources, mentorship, and a sense of {community}. If you like to [donate to help us help others, go here](https://www.somos.tech/donate).

Thank you for using our tools! We hope they help streamline your Wix membership migrations.