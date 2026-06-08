# Client Onboarding SOP

**Version:** 1.0  
**Date:** June 2026  
**Owner:** Customer Success  
**Applies to:** Mind Measure Pro (corporate) and Mind Measure (university)

---

## Purpose

This SOP covers the full onboarding process from signed contract to first live check-in. It is written for the Customer Success role and documents every step needed to provision an account, configure the platform, train the client's team, and launch to employees or students.

---

## Scope and variants

The process is the same for both products at a high level. Where the corporate (Pro) and university workflows differ, this is noted explicitly. Look for:

- **[Pro only]** for steps that apply to corporate clients only
- **[Uni only]** for steps that apply to university clients only
- No marker means the step applies to both

---

## Roles and responsibilities

| Role | Responsibilities in onboarding |
|---|---|
| Account Manager | Confirms signed contract; makes warm handoff to CS; attends kick-off call |
| Customer Success | Owns the full onboarding process end to end; sends intake form; configures the platform; delivers training; coordinates launch |
| Comms | Handles brand asset import (logo, colours, hero image) as a side workstream |
| Client: HR / Programme Owner | Primary point of contact; returns the completed intake form; owns internal launch communications |
| Client: IT contact | Assists with email domain configuration and SSO where required |
| Client: Welfare Lead | Named escalation contact for high-risk detections; receives safeguarding notifications |
| [Uni only] Client: Safeguarding Contact | Designated safeguarding officer; receives Level 4 welfare notifications |

---

## Timeline overview

The standard onboarding runs over four to six weeks from contract signature to launch. The intake form is the critical path item: nothing can be configured until it is returned.

| Week | Key activity |
|---|---|
| Week 1 | Contract signed; intake form sent; kick-off call booked |
| Week 2 | Kick-off call; intake form returned |
| Week 3 | Platform configured; smoke test completed; DPA signed |
| Week 4 | Admin training delivered; launch comms prepared |
| Week 5-6 | Launch date; first check-ins; account status set to live |

If the intake form is late, push all subsequent dates accordingly.

---

## Phase 1: Contract to kick-off

### Step 1.1 — Receive handoff from Account Manager

The Account Manager confirms the contract is signed and passes the following to Customer Success:

- Client name and primary contact
- Agreed pilot scope (headcount, business units, countries)
- Agreed launch date
- Any commercial concessions to note (for example, custom Jodie questions waived or included)
- Notes from any pre-sales conversations relevant to configuration

**Owner:** Account Manager (handing off), Customer Success (receiving)

### Step 1.2 — Create the onboarding record

Open the onboarding tracker and create a new row for the client. Record:

- Client name and slug (generate slug from display name, e.g. "Acme Corp" → `acme-corp`; confirm uniqueness before saving)
- Assigned Customer Success contact
- Target launch date
- Intake form sent date (to be filled when sent)

**Owner:** Customer Success

### Step 1.3 — Send the intake form

Send the client the Company Onboarding Questionnaire. The questionnaire covers twelve sections:

1. About your organisation
2. People we will work with
3. How your organisation is structured
4. Workplace details we ask employees for
5. Signing in
6. Your existing wellbeing support
7. External crisis support
8. Hierarchy of help
9. Bespoke check-in questions (optional)
10. Data, privacy and reporting
11. Launch and training
12. Anything else

The fillable Word version is at `/downloads/mind-measure-onboarding-questionnaire.docx`. Attach it to the email and tell the client to return it within five working days. Remind them that sections 2, 3, 5, 6 and 10 are the most important and to prioritise those if they are short on time.

**Owner:** Customer Success  
**Timing:** Send within 24 hours of receiving the handoff

### Step 1.4 — Book the kick-off call

Book a 60-minute kick-off call with the client's HR / Programme Owner, IT contact, and Welfare Lead. The kick-off call can happen before or after the intake form is returned; ideally schedule it for the same week the form is due back so you can clarify any open questions live.

**Kick-off call agenda:**

1. Introductions (5 minutes)
2. Platform walkthrough: what the employee sees versus what the admin sees (15 minutes)
3. Walk through the intake form: answer any questions, flag missing sections (20 minutes)
4. Agree configuration timeline and launch date (10 minutes)
5. Confirm DPA approach (5 minutes)
6. Next steps (5 minutes)

**Owner:** Customer Success

---

## Phase 2: Intake processing and configuration

### Step 2.1 — Receive and review the intake form

When the completed form arrives, check it before starting configuration. Flag any of the following to the client within one working day:

- Sections 2.1 (HR owner) or 2.2 (welfare lead) missing: both are required before launch
- Section 5.1 (email domains) blank: configuration cannot proceed without at least one domain
- Section 10.6 (DPA): if yes, initiate the DPA process in parallel (see Step 2.10)
- [Uni only] Safeguarding contact (name, email, phone, role): required before launch

**Owner:** Customer Success  
**Target time:** Complete review within one working day of receiving the form

### Step 2.2 — Create the company shell

Navigate to Superuser → Companies → New in the CMS. Enter:

- Registered company name (section 1.1)
- Display name / short name (section 1.2)
- Website (section 1.3)
- HQ address (section 1.4)
- Total employee headcount (section 1.6)
- Slug (generated from display name; confirm uniqueness)

Set status to `planning`. Do not set to `launched` until the smoke test passes and the launch date is confirmed.

**Owner:** Customer Success  
**Reference:** company-intake-internal.mdx, Section 1

### Step 2.3 — Build the org structure

Go to the Organisational Structure tab. Enter:

- Divisions and their departments (section 3.1), with headcount per department if the client provided it
- Offices with city, country, and headcount (section 3.2)
- Per-office Mental Health First Aiders from section 2.4 (name, contact, coverage note)

If the client did not provide headcount per department, leave those fields blank. The dashboard will show an honest empty state.

**Owner:** Customer Success  
**Reference:** company-intake-internal.mdx, Sections 2 and 3

### Step 2.4 — Configure employee profile fields

Go to the Employee fields tab. The corporate defaults from migration 013 are already in place for a new company shell. Review section 4 of the intake form and apply any client overrides:

- Business unit label (section 4.1)
- Team / practice label (section 4.2)
- Seniority ladder options (section 4.3): copy the client's exact ladder
- Work mode options (section 4.4): copy the client's exact options
- Primary office label (section 4.5)
- Any bespoke fields (section 4.6): add as `select` or `text` type with a field key

Do not add separate Country or City fields. Location is derived from the office question.

Use "Reset to recommended" to restore corporate defaults at any time.

**Owner:** Customer Success  
**Reference:** company-intake-internal.mdx, Section 4

### Step 2.5 — Set allowed email domains

Go to the Settings tab. Enter all allowed domains from sections 5.1 (employee domains) and 5.2 (contractor or partner domains) into the Allowed email domains field.

If a non-database override is needed immediately (for testing or demo purposes), also add the domain to `DOMAIN_OVERRIDES` in `mind-measure-pro-mobile/src/services/CompanyResolver.ts`.

If the client requires SSO (section 5.4), raise this as a separate ticket: SSO is a Cognito identity provider configuration and has its own implementation timeline. Confirm with the client whether SSO is required before launch or can be added post-launch.

**Owner:** Customer Success  
**Reference:** company-intake-internal.mdx, Section 5

### Step 2.6 — Configure emergency resources

Go to the Emergency Resources tab. Enter:

- EAP details (section 6.1): use the dedicated EAP tab. Complete all descriptive fields (tagline, description, what they offer, how to access) as well as contact details. Enable the toggle so Jodie can reference the EAP conversationally.
- Other wellbeing programmes (section 6.5): add each as an additional EAP entry on the same tab.
- HR / People support (section 6.2)
- Occupational health (section 6.3)
- External crisis services (section 7): if the client did not list anything, leave the platform defaults for their country in place.

**[Uni only]** Universities list campus-based services in place of EAP entries. Add counselling services, the wellbeing team contact, and the student union support line.

**Owner:** Customer Success  
**Reference:** company-intake-internal.mdx, Sections 6 and 7

### Step 2.7 — Configure the Hierarchy of Help

Go to the Hierarchy of Help tab. The default escalation order is:

1. Line manager / HR Business Partner
2. EAP (24/7)
3. Mental Health First Aider
4. National crisis line
5. Emergency services

Apply any overrides from section 8 of the intake form.

**[Uni only]** The university equivalent uses a student-facing buddy-first model. Ensure the buddy system is listed as step 1, ahead of the university wellbeing team and Student Minds.

**Owner:** Customer Success  
**Reference:** company-intake-internal.mdx, Section 8; hierarchy-of-help.mdx

### Step 2.8 — Add bespoke Jodie questions

If the client provided bespoke questions (section 9), go to the Institutional Agents tab and enter each question under Custom questions. Up to five questions are included on the standard tier.

For each question, configure:
- The question text exactly as supplied
- When to ask it (always / first month / specific week)
- Whether results appear as a dashboard filter

After saving, confirm that Jodie regeneration triggered successfully via the `/api/agents/create` endpoint. Verify the new prompt is live before proceeding to the smoke test.

**Owner:** Customer Success  
**Reference:** company-intake-internal.mdx, Section 9

### Step 2.9 — Apply privacy and reporting settings

Go to the Settings tab. Apply section 10 answers:

- Who can see results: configure RBAC role visibility accordingly
- Cohort minimum size (section 10.2): default is 5; never set below 5
- Data retention period (section 10.3)
- Reporting cadence (section 10.4)
- Report format and channels (section 10.5)
- Data residency requirements (section 10.7): note any requirements that deviate from the UK default (eu-west-2 Aurora)

**Owner:** Customer Success  
**Reference:** company-intake-internal.mdx, Section 10

### Step 2.10 — DPA

If section 10.6 confirms the client needs a DPA, send the standard Mind Measure DPA template. Do not proceed to launch until a signed copy is received and filed. Add the signed copy to the client folder in the data room.

**Owner:** Customer Success / Legal  
**Timing:** Initiate in parallel with configuration; must be signed before launch

### Step 2.11 — Brand assets (side workstream)

Brand assets are handled by Comms, not Customer Success. At the point configuration is complete, ensure Comms has been briefed to collect:

- Logo files (upload via Settings → Brand; stored in S3)
- Primary and secondary brand colours (Settings → primary_color / secondary_color)
- Hero image (optional)

This workstream runs in parallel. It does not block the smoke test.

**Owner:** Comms

---

## Phase 3: Testing and launch preparation

### Step 3.1 — Run the smoke test

The smoke test confirms the configuration is complete and correct. Carry it out before delivering admin training.

Sign in to the mobile app using a test email address that matches one of the allowed domains. Work through the following:

- Baseline assessment completes without error
- Employee profile questions surface the correct divisions, departments, offices, and any bespoke fields in the correct order
- Open the admin dashboard and confirm the cohort filters reflect the correct division and department lists
- Check that emergency resources (EAP, HR, crisis services) appear correctly in the app Help screen
- [If bespoke questions configured] Confirm bespoke questions appear in the check-in flow

If anything is wrong, fix it and re-run the affected section before proceeding.

**Owner:** Customer Success

### Step 3.2 — Deliver admin training

Book a 45-minute walkthrough for the client's HR and welfare team. Confirm whether this is wanted at section 11.1 of the intake form; most clients will say yes.

Cover:

- Dashboard overview: what the scores mean, what the cohort filters are for
- Wellbeing trends view: how to read population-level data
- RBAC: how to grant and revoke dashboard access for HR team members
- Wellbeing reports: how to set up scheduled reports and run on-demand exports
- [Pro only] Institutional weekly summary: how to access and share the on-demand weekly summary
- [Uni only] Content Hub and Insight Hub: walkthrough of both
- Safeguarding and escalation: what happens when the system detects a high-risk score; who receives notifications and what they contain
- Admin tasks: how to add a new division, update an office, change the hierarchy of help

Deliver the admin dashboard URL and a link to the relevant handbook (Mind Measure Pro Employer Handbook or Mind Measure University Handbook) at the close of the session.

**Owner:** Customer Success  
**Timing:** At least one week before launch

### Step 3.3 — Confirm internal launch communications

Identify the client's internal comms owner (section 11.2). Agree the following at least two weeks before launch:

- Launch announcement channel (email, intranet, all-hands, Slack/Teams, or a combination)
- Messaging: Mind Measure provides a standard launch communication template; customise it to the client's tone and brand
- Dates to avoid (section 11.3)
- App download instructions for iOS and Android

The client's communications team owns the distribution. Customer Success provides the content.

**[Uni only]** For universities, include student-facing messaging that explains the consent model clearly: individual scores are private; the university only receives anonymised population data; the consent screen before the first check-in explains when and how safeguarding disclosure works.

**Owner:** Customer Success (content), Client comms owner (distribution)

---

## Phase 4: Launch

### Step 4.1 — Pre-launch checklist

Run through this checklist the working day before launch:

- [ ] DPA signed and filed
- [ ] Smoke test passed
- [ ] All emergency resources correctly configured
- [ ] Safeguarding / welfare lead contacts confirmed in the platform
- [ ] [Uni only] Safeguarding contact fields populated (name, email, phone, role)
- [ ] Admin training delivered
- [ ] Client comms owner has the launch message and app download links
- [ ] Brand assets uploaded (logo at minimum; colours if supplied)
- [ ] Renewal calendar reminder set
- [ ] Onboarding tracker updated

**Owner:** Customer Success

### Step 4.2 — Set status to launched

On the agreed launch date, navigate to the company record in the CMS and flip `status` from `planning` to `launched`.

Confirm this has been done and notify the Account Manager.

**Owner:** Customer Success

### Step 4.3 — First check-in confirmation

Within 48 hours of launch, confirm that at least one real check-in has been completed. This is evidence the sign-in flow, domain check, baseline, and check-in pipeline are all working end to end for real users on the client's domains.

If no check-ins appear within 48 hours:

1. Contact the client to confirm app download communications went out
2. Check that allowed domains are correctly configured
3. Run a fresh smoke test with the same domain

**Owner:** Customer Success

---

## Phase 5: Post-launch

### Step 5.1 — Check-in at one week

Contact the HR / Programme Owner at the end of the first full week. Confirm:

- Uptake is in line with expectations
- No sign-in or access issues reported
- Dashboard is rendering correctly
- Any questions from the admin team

**Owner:** Customer Success

### Step 5.2 — Pilot review

At the agreed pilot review date (typically end of trial, section 1.9), prepare a pilot summary covering:

- Uptake rate against pilot cohort size
- Population wellbeing trend over the pilot period
- Any notable cohort patterns (anonymous, minimum cohort size enforced)
- Issues raised and resolved
- Recommendation on renewal or full rollout

**Owner:** Customer Success (data), Account Manager (commercial conversation)

---

## Key reference documents

| Document | Location |
|---|---|
| Company Onboarding Questionnaire | `/operations/company-intake` |
| Internal intake field mapping | `/operations/company-intake-internal` |
| Hierarchy of Help | `/operations/hierarchy-of-help` |
| Wellbeing Protection Policy | `/operations/wellbeing-protection-policy` |
| Mind Measure Pro Employer Handbook | `/handbook-pro` |
| Mind Measure University Handbook | `/handbook` |
| Database provisioning playbook | `/operations/playbooks` |

---

*© 2026 Mind Measure Ltd. Internal use only. Do not share externally.*
