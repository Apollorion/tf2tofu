# TF2Tofu - Redirect Links To OpenTofu Docs

This is a Chromium (Google Chrome, Arc, Edge, etc) extension that will redirect you to the correct OpenTofu registry documentation when you click on a link that would normally take you to the Terraform registry documentation.

This plugin currently supports the following redirects:
- Providers, and their Datasources and Resources (to the correct version based off the original link)
- Modules
- Search Pages
- Browsing Modules and Providers
- Any of the docs under `developer.hashicorp.com/terraform`

## Installation

1. Clone this repository `git clone https://github.com/Apollorion/tf2tofu.git`
2. Open your Chromium browser and navigate to `chrome://extensions/`
3. Enable Developer Mode
4. Click "Load Unpacked" and select the `extension` directory where you cloned this repository
5. ???
6. Profit!