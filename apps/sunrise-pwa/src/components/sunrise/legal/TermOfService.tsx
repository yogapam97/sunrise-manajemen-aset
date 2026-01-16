import React from "react";

import { Box, List, Link, ListItem, Container, Typography, ListItemText } from "@mui/material";

import LegalContact from "./LegalContact";

const TermOfService: React.FC = () => (
  <Container>
    <Typography variant="h4" gutterBottom>
      Terms of Service for Sunrise App
    </Typography>

    <Box marginBottom={4}>
      <Typography variant="h6" gutterBottom>
        Table of Contents
      </Typography>
      <List>
        <ListItem component={Link} href="#introduction">
          <ListItemText primary="1. Introduction" />
        </ListItem>
        <ListItem component={Link} href="#acceptance">
          <ListItemText primary="2. Acceptance of Terms" />
        </ListItem>
        <ListItem component={Link} href="#purpose">
          <ListItemText primary="3. Purpose" />
        </ListItem>
        <ListItem component={Link} href="#user-scope">
          <ListItemText primary="4. User Scope" />
        </ListItem>
        <ListItem component={Link} href="#features">
          <ListItemText primary="5. Features" />
        </ListItem>
        <ListItem component={Link} href="#user-responsibilities">
          <ListItemText primary="6. User Responsibilities" />
        </ListItem>
        <ListItem component={Link} href="#data-handling">
          <ListItemText primary="7. Data Handling" />
        </ListItem>
        <ListItem component={Link} href="#data-privacy">
          <ListItemText primary="8. Data Privacy and Security" />
        </ListItem>
        <ListItem component={Link} href="#support">
          <ListItemText primary="9. Support and Updates" />
        </ListItem>
        <ListItem component={Link} href="#liability">
          <ListItemText primary="10. Limitations of Liability" />
        </ListItem>
        <ListItem component={Link} href="#indemnification">
          <ListItemText primary="11. Indemnification" />
        </ListItem>
        <ListItem component={Link} href="#changes">
          <ListItemText primary="12. Changes to Terms of Service" />
        </ListItem>
        <ListItem component={Link} href="#governing-law">
          <ListItemText primary="13. Governing Law" />
        </ListItem>
        <ListItem component={Link} href="#contact">
          <ListItemText primary="14. Contact Information" />
        </ListItem>
      </List>
    </Box>

    <Typography variant="h6" gutterBottom id="introduction">
      1. Introduction
    </Typography>
    <Typography paragraph>
      Welcome to Stageholder, an app designed to manage fixed assets and inventory efficiently. By
      using Stageholder, you agree to comply with and be bound by the following terms of service.
      Please review them carefully before using our app.
    </Typography>

    <Typography variant="h6" gutterBottom id="acceptance">
      2. Acceptance of Terms
    </Typography>
    <Typography paragraph>
      By accessing or using Stageholder, you agree to be bound by these terms of service and our
      privacy policy. If you do not agree to these terms, you may not use the app.
    </Typography>

    <Typography variant="h6" gutterBottom id="purpose">
      3. Purpose
    </Typography>
    <Typography paragraph>
      Stageholder is a comprehensive tool for managing fixed assets and inventory, enabling users
      to:
    </Typography>
    <List>
      <ListItem>
        <ListItemText primary="Create, read, update, and delete (CRUD) fixed asset and inventory information." />
      </ListItem>
      <ListItem>
        <ListItemText primary="Track changes to fixed asset information." />
      </ListItem>
      <ListItem>
        <ListItemText primary="Generate labels such as barcodes, QR codes, and RFID tags." />
      </ListItem>
      <ListItem>
        <ListItemText primary="Scan labels using user-owned devices." />
      </ListItem>
      <ListItem>
        <ListItemText primary="Audit status conditions." />
      </ListItem>
      <ListItem>
        <ListItemText primary="Perform check-ins and check-outs." />
      </ListItem>
      <ListItem>
        <ListItemText primary="Calculate depreciation and other related functions." />
      </ListItem>
    </List>

    <Typography variant="h6" gutterBottom id="user-scope">
      4. User Scope
    </Typography>
    <Typography paragraph>
      Stageholder is designed for use by both businesses and individuals seeking to manage their
      fixed assets and inventory.
    </Typography>

    <Typography variant="h6" gutterBottom id="features">
      5. Features
    </Typography>
    <Typography paragraph>Stageholder offers the following features:</Typography>
    <List>
      <ListItem>
        <ListItemText primary="CRUD operations for fixed assets and inventory." />
      </ListItem>
      <ListItem>
        <ListItemText primary="Tracking of changes in asset information." />
      </ListItem>
      <ListItem>
        <ListItemText primary="Label generation (barcodes, QR codes, RFID tags)." />
      </ListItem>
      <ListItem>
        <ListItemText primary="Scanning of labels with user devices." />
      </ListItem>
      <ListItem>
        <ListItemText primary="Audit status condition management." />
      </ListItem>
      <ListItem>
        <ListItemText primary="Check-in and check-out processes." />
      </ListItem>
      <ListItem>
        <ListItemText primary="Depreciation calculation." />
      </ListItem>
      <ListItem>
        <ListItemText primary="Additional functions related to fixed assets and inventory management." />
      </ListItem>
    </List>

    <Typography variant="h6" gutterBottom id="user-responsibilities">
      6. User Responsibilities
    </Typography>
    <Typography paragraph>Users of Stageholder are responsible for:</Typography>
    <List>
      <ListItem>
        <ListItemText primary="Recording and managing the data they input into the app." />
      </ListItem>
      <ListItem>
        <ListItemText primary="Implementing and utilizing the functionalities provided by the app." />
      </ListItem>
      <ListItem>
        <ListItemText primary="Ensuring the accuracy and integrity of their data." />
      </ListItem>
      <ListItem>
        <ListItemText primary="Keeping their login credentials secure and confidential." />
      </ListItem>
      <ListItem>
        <ListItemText primary="Complying with all applicable laws and regulations while using the app." />
      </ListItem>
    </List>

    <Typography variant="h6" gutterBottom id="data-handling">
      7. Data Handling
    </Typography>
    <Typography paragraph>
      Data handling within Stageholder depends on the user’s subscription plan:
    </Typography>
    <List>
      <ListItem>
        <ListItemText primary="Our Server: For users who subscribe to our server-based plan, our team will handle data management and storage. We implement industry-standard security measures to protect user data." />
      </ListItem>
      <ListItem>
        <ListItemText primary="User’s Server: For users who choose to host data on their own servers, they will be responsible for managing their own data. Users are expected to implement their own security measures to protect their data. However, support can be provided upon request." />
      </ListItem>
    </List>

    <Typography variant="h6" gutterBottom id="data-privacy">
      8. Data Privacy and Security
    </Typography>
    <Typography paragraph>
      We are committed to protecting your data privacy and security. Depending on the chosen data
      handling option, appropriate measures are implemented to ensure data protection:
    </Typography>
    <List>
      <ListItem>
        <ListItemText primary="Our Server: Data is stored securely on our servers, and our team implements industry-standard security measures such as encryption and access controls to safeguard your data." />
      </ListItem>
      <ListItem>
        <ListItemText primary="User’s Server: Users are responsible for implementing their own security measures, including encryption, access controls, and regular backups. We can offer guidance and support to help ensure data security." />
      </ListItem>
    </List>

    <Typography variant="h6" gutterBottom id="support">
      9. Support and Updates
    </Typography>
    <Typography paragraph>
      Support and updates for Stageholder are provided based on the user’s subscription plan:
    </Typography>
    <List>
      <ListItem>
        <ListItemText primary="Regular updates and improvements to enhance functionality and security." />
      </ListItem>
      <ListItem>
        <ListItemText primary="Support services available as per the subscription terms, including email and chat support." />
      </ListItem>
      <ListItem>
        <ListItemText primary="Users hosting data on their own servers can also receive support upon request, subject to additional fees." />
      </ListItem>
    </List>

    <Typography variant="h6" gutterBottom id="liability">
      10. Limitations of Liability
    </Typography>
    <Typography paragraph>
      Stageholder is provided "as is" without warranties of any kind, either express or implied. We
      do not guarantee that the app will be free from errors, interruptions, or that it will meet
      your specific requirements. To the fullest extent permitted by law, we disclaim all
      warranties, express or implied, including but not limited to, implied warranties of
      merchantability and fitness for a particular purpose.
    </Typography>
    <Typography paragraph>
      We are not liable for any direct, indirect, incidental, or consequential damages arising from
      the use or inability to use Stageholder, including but not limited to, damages for loss of
      profits, data, or other intangibles, even if we have been advised of the possibility of such
      damages.
    </Typography>

    <Typography variant="h6" gutterBottom id="indemnification">
      11. Indemnification
    </Typography>
    <Typography paragraph>
      You agree to indemnify, defend, and hold harmless Stageholder and its affiliates, officers,
      directors, employees, and agents from and against any claims, liabilities, damages, losses,
      and expenses, including but not limited to, reasonable legal and accounting fees, arising out
      of or in any way connected with your access to or use of the app, your violation of these
      terms of service, or your infringement of any intellectual property or other right of any
      person or entity.
    </Typography>

    <Typography variant="h6" gutterBottom id="changes">
      12. Changes to Terms of Service
    </Typography>
    <Typography paragraph>
      We reserve the right to modify these terms of service at any time. Users will be notified of
      any significant changes via email or within the app. Continued use of the app constitutes
      acceptance of the new terms. If you do not agree with the modified terms, you should
      discontinue use of the app.
    </Typography>

    <Typography variant="h6" gutterBottom id="governing-law">
      13. Governing Law
    </Typography>
    <Typography paragraph>
      These terms of service are governed by and construed in accordance with the laws of [Your
      Jurisdiction], without regard to its conflict of law principles. Any disputes arising from
      these terms of service or the use of Stageholder will be subject to the exclusive jurisdiction
      of the courts located in [Your Jurisdiction].
    </Typography>

    <Typography variant="h6" gutterBottom id="contact">
      14. Contact Information
    </Typography>
    <Typography paragraph>
      If you have any questions or concerns regarding these terms of service, please contact our
      support team at:
    </Typography>

    <LegalContact />

    <Typography paragraph>
      By using Stageholder, you acknowledge that you have read, understood, and agree to these terms
      of service. Thank you for choosing Stageholder for your fixed asset and inventory management
      needs.
    </Typography>
  </Container>
);

export default TermOfService;
