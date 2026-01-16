import React from "react";

import { Box, List, Link, ListItem, Container, Typography, ListItemText } from "@mui/material";

import LegalContact from "./LegalContact";

const PrivacyPolicy: React.FC = () => (
  <Container>
    <Typography variant="h4" gutterBottom>
      Privacy Policy for Sunrise App
    </Typography>

    <Box marginBottom={4}>
      <Typography variant="h6" gutterBottom>
        Table of Contents
      </Typography>
      <List>
        <ListItem component={Link} href="#introduction">
          <ListItemText primary="1. Introduction" />
        </ListItem>
        <ListItem component={Link} href="#data-collection">
          <ListItemText primary="2. Data Collection" />
        </ListItem>
        <ListItem component={Link} href="#data-use">
          <ListItemText primary="3. Data Use" />
        </ListItem>
        <ListItem component={Link} href="#data-sharing">
          <ListItemText primary="4. Data Sharing" />
        </ListItem>
        <ListItem component={Link} href="#data-security">
          <ListItemText primary="5. Data Security" />
        </ListItem>
        <ListItem component={Link} href="#data-retention">
          <ListItemText primary="6. Data Retention" />
        </ListItem>
        <ListItem component={Link} href="#user-rights">
          <ListItemText primary="7. User Rights" />
        </ListItem>
        <ListItem component={Link} href="#changes">
          <ListItemText primary="8. Changes to Privacy Policy" />
        </ListItem>
        <ListItem component={Link} href="#contact">
          <ListItemText primary="9. Contact Information" />
        </ListItem>
      </List>
    </Box>

    <Typography variant="h6" gutterBottom id="introduction">
      1. Introduction
    </Typography>
    <Typography paragraph>
      Welcome to Stageholder. We are committed to protecting your privacy and ensuring that your
      personal information is handled in a safe and responsible manner. This Privacy Policy outlines
      how we collect, use, and share your information.
    </Typography>

    <Typography variant="h6" gutterBottom id="data-collection">
      2. Data Collection
    </Typography>
    <Typography paragraph>
      We collect various types of information in connection with the services we provide, including:
    </Typography>
    <List>
      <ListItem>
        <ListItemText primary="Personal Information: Name, email address, phone number, and other contact details." />
      </ListItem>
      <ListItem>
        <ListItemText primary="Account Information: Login credentials, subscription details, and usage data." />
      </ListItem>
      <ListItem>
        <ListItemText primary="Device Information: IP address, browser type, and operating system." />
      </ListItem>
      <ListItem>
        <ListItemText primary="Fixed Asset and Inventory Data: Information you input about your fixed assets and inventory." />
      </ListItem>
    </List>

    <Typography variant="h6" gutterBottom id="data-use">
      3. Data Use
    </Typography>
    <Typography paragraph>We use the collected data for the following purposes:</Typography>
    <List>
      <ListItem>
        <ListItemText primary="To provide and maintain our services." />
      </ListItem>
      <ListItem>
        <ListItemText primary="To manage user accounts and provide customer support." />
      </ListItem>
      <ListItem>
        <ListItemText primary="To improve our services and develop new features." />
      </ListItem>
      <ListItem>
        <ListItemText primary="To communicate with users about updates, promotions, and other information." />
      </ListItem>
      <ListItem>
        <ListItemText primary="To comply with legal obligations and resolve disputes." />
      </ListItem>
    </List>

    <Typography variant="h6" gutterBottom id="data-sharing">
      4. Data Sharing
    </Typography>
    <Typography paragraph>
      We may share your information with third parties in the following circumstances:
    </Typography>
    <List>
      <ListItem>
        <ListItemText primary="With service providers who perform services on our behalf, such as payment processing, data analysis, and email delivery." />
      </ListItem>
      <ListItem>
        <ListItemText primary="In response to a legal request, such as a court order or subpoena." />
      </ListItem>
      <ListItem>
        <ListItemText primary="To protect the rights, property, and safety of Stageholder, our users, or the public." />
      </ListItem>
      <ListItem>
        <ListItemText primary="With your consent or at your direction." />
      </ListItem>
    </List>

    <Typography variant="h6" gutterBottom id="data-security">
      5. Data Security
    </Typography>
    <Typography paragraph>
      We implement industry-standard security measures to protect your data from unauthorized
      access, disclosure, alteration, or destruction. These measures include encryption, access
      controls, and regular security assessments.
    </Typography>

    <Typography variant="h6" gutterBottom id="data-retention">
      6. Data Retention
    </Typography>
    <Typography paragraph>
      We retain your information for as long as necessary to provide our services, comply with legal
      obligations, resolve disputes, and enforce our agreements. The retention period will be
      determined based on the nature of the data and the purposes for which it was collected.
    </Typography>

    <Typography variant="h6" gutterBottom id="user-rights">
      7. User Rights
    </Typography>
    <Typography paragraph>
      You have the following rights regarding your personal information:
    </Typography>
    <List>
      <ListItem>
        <ListItemText primary="Access: You can request access to your personal information and obtain a copy of it." />
      </ListItem>
      <ListItem>
        <ListItemText primary="Correction: You can request corrections to your personal information if it is inaccurate or incomplete." />
      </ListItem>
      <ListItem>
        <ListItemText primary="Deletion: You can request the deletion of your personal information, subject to certain legal requirements." />
      </ListItem>
      <ListItem>
        <ListItemText primary="Objection: You can object to the processing of your personal information in certain circumstances." />
      </ListItem>
      <ListItem>
        <ListItemText primary="Restriction: You can request the restriction of processing your personal information in certain circumstances." />
      </ListItem>
      <ListItem>
        <ListItemText primary="Portability: You can request to receive your personal information in a structured, commonly used, and machine-readable format." />
      </ListItem>
    </List>

    <Typography variant="h6" gutterBottom id="changes">
      8. Changes to Privacy Policy
    </Typography>
    <Typography paragraph>
      We may update this Privacy Policy from time to time. We will notify you of any significant
      changes by posting the new Privacy Policy on our website or through the app. You are advised
      to review this Privacy Policy periodically for any changes.
    </Typography>

    <Typography variant="h6" gutterBottom id="contact">
      9. Contact Information
    </Typography>
    <Typography paragraph>
      If you have any questions or concerns about this Privacy Policy or our data practices, please
      contact us at:
    </Typography>
    <LegalContact />

    <Typography paragraph>
      By using Stageholder, you acknowledge that you have read, understood, and agree to this
      Privacy Policy.
    </Typography>
  </Container>
);

export default PrivacyPolicy;
