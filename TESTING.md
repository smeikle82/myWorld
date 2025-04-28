# AI-Powered Roleplay Toolkit - Test Cases

This document outlines manual test cases for verifying the core functionality of the application.

## 1. Character Management (`/characters` Tab)

| Test Case ID | Description                                                                 | Expected Result                                                                                                | Status     |
| :----------- | :-------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------- | :--------- |
| CM-01        | Add a new Player character with valid data (all fields filled correctly).   | Character appears in the table, success notification shown, data persists after refresh.                      | Pending    |
| CM-02        | Add a new NPC character with valid data.                                    | Character appears in the table, success notification shown, data persists after refresh.                      | Pending    |
| CM-03        | Add a new Enemy character with valid data.                                  | Character appears in the table, success notification shown, data persists after refresh.                      | Pending    |
| CM-04        | Attempt to add a character with missing Name.                               | Form shows validation error for Name field, character not added.                                               | Pending    |
| CM-05        | Attempt to add a character with Health < 0.                               | Form shows validation error for Health field (or NumberInput prevents it), character not added.              | Pending    |
| CM-06        | Attempt to add a character with a Stat > 20 or < 1.                       | Form shows validation error for the Stat field (or NumberInput prevents it), character not added.            | Pending    |
| CM-07        | Edit an existing character's Name and Health.                               | Changes are reflected in the table, success notification shown, changes persist after refresh.                  | Pending    |
| CM-08        | Edit an existing character's Stats and Notes.                               | Changes persist (verify by re-opening edit modal), changes persist after refresh.                              | Pending    |
| CM-09        | Delete an existing character (confirm prompt).                              | Character is removed from the table, delete notification shown, character remains deleted after refresh.        | Pending    |
| CM-10        | Delete an existing character (cancel prompt).                               | Character remains in the table, no delete notification shown.                                                  | Pending    |
| CM-11        | Filter characters by Type 'Player'.                                         | Only Player characters are shown in the table.                                                                 | Pending    |
| CM-12        | Filter characters by Type 'NPC'.                                            | Only NPC characters are shown in the table.                                                                    | Pending    |
| CM-13        | Filter characters by Type 'Enemy'.                                          | Only Enemy characters are shown in the table.                                                                  | Pending    |
| CM-14        | Filter characters by Type 'All Types'.                                      | All characters are shown in the table.                                                                         | Pending    |
| CM-15        | Search for a character by full name (case-insensitive).                     | Only the matching character(s) are shown.                                                                      | Pending    |
| CM-16        | Search for characters by partial name (case-insensitive).                   | All characters matching the partial name are shown.                                                            | Pending    |
| CM-17        | Search with a term that matches no characters.                              | Table shows "No characters found." message.                                                                  | Pending    |
| CM-18        | Clear search term after filtering/searching.                                | Table returns to showing characters based on the Type filter only.                                             | Pending    |
| CM-19        | Refresh page after adding/editing/deleting data.                            | All changes are correctly persisted in localStorage and displayed on reload.                                   | Pending    |

## 2. Dice Roller (`/roller` Tab)

*Prerequisite: At least 2 characters exist.* 

| Test Case ID | Description                                                                  | Expected Result                                                                                                | Status     |
| :----------- | :--------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------- | :--------- |
| DR-01        | Select Initiating Character only.                                            | Roll button remains disabled.                                                                                  | Pending    |
| DR-02        | Select Initiating Character and Encounter Type 'Exploration' (requires DC).  | Roll button becomes enabled. Perform roll. Result display shows outcome (Success/Failure/Tie).                 | Pending    |
| DR-03        | Select Initiating Character and Encounter Type 'CustomDC'.                   | DC input appears. Roll button remains disabled.                                                              | Pending    |
| DR-04        | Select Initiating Character, Type 'CustomDC', enter valid DC (e.g., 12).     | Roll button becomes enabled. Perform roll. Result display shows outcome.                                       | Pending    |
| DR-05        | Select Initiating Character and Encounter Type 'Combat' (opposed).           | Opposing Character selector appears. Roll button remains disabled.                                             | Pending    |
| DR-06        | Select Initiating Character, Opposing Character, and Type 'Combat'.          | Roll button becomes enabled. Perform roll. Result display shows outcome.                                       | Pending    |
| DR-07        | Select Initiating Character, Type 'Social' (opposed).                        | Opposing Character selector appears. Roll button remains disabled.                                             | Pending    |
| DR-08        | Select Initiating Character, Opposing Character, and Type 'Social'.          | Roll button becomes enabled. Perform roll. Result display shows outcome.                                       | Pending    |
| DR-09        | Change Encounter Type from opposed ('Combat') to non-opposed ('Exploration'). | Opposing Character selector disappears. Roll button state updates accordingly.                                 | Pending    |
| DR-10        | Change Encounter Type from non-opposed ('Exploration') to opposed ('Social'). | Opposing Character selector appears. Roll button state updates accordingly.                                    | Pending    |
| DR-11        | Perform multiple rolls in succession.                                        | Each roll generates a new result and updates the display.                                                      | Pending    |

## 3. Oracle System (`/oracle` Tab)

| Test Case ID | Description                                               | Expected Result                                                                            | Status     |
| :----------- | :-------------------------------------------------------- | :----------------------------------------------------------------------------------------- | :--------- |
| OS-01        | Load the Oracle tab without selecting Likelihood.         | "Ask the Oracle" button is disabled.                                                       | Pending    |
| OS-02        | Select a Likelihood level (e.g., 'Likely').             | "Ask the Oracle" button becomes enabled.                                                 | Pending    |
| OS-03        | Select a Likelihood and click "Ask the Oracle".         | Result display shows outcome string (e.g., 'Yes', 'No, but...'), roll, and likelihood used. | Pending    |
| OS-04        | Ask the Oracle multiple times with the same Likelihood. | Each click generates a new result based on a new d100 roll.                                | Pending    |
| OS-05        | Ask the Oracle with different Likelihood levels.          | Results are generated correctly according to the selected likelihood's probability table. | Pending    |

## 4. General Application Functionality

| Test Case ID | Description                                                                                                | Expected Result                                                                                                                                  | Status     |
| :----------- | :--------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- | :--------- |
| GEN-01       | Toggle theme using the theme toggle button.                                                                  | UI theme switches between light and dark mode.                                                                                                   | Pending    |
| GEN-02       | Change theme, navigate between tabs, and refresh the page.                                                   | Selected theme persists across navigation and page reloads.                                                                                      | Pending    |
| GEN-03       | Navigate between Character Manager, Dice Roller, and Oracle tabs.                                          | The correct component/view is displayed for each tab. URL path updates correctly. Lazy loading shows loader briefly on first visit to each tab. | Pending    |
| GEN-04       | Resize browser window to simulate different screen sizes (basic check).                                      | Layout adjusts reasonably, no major elements overlap or break. (Specific responsive design not implemented yet).                                 | Pending    |
| GEN-05       | Test data versioning: Clear localStorage, reload, add data, verify functionality.                              | Application works normally with version 1 data.                                                                                                  | Pending    |
| GEN-06       | Test data versioning: Manually edit `CURRENT_DATA_VERSION` in `storage.ts` to 2, reload application.         | Console shows version mismatch warning for 'characters' key. Character list is empty (old data discarded). Application still loads.              | Pending    |
| GEN-07       | Test data versioning: Set version back to 1 in `storage.ts`, reload.                                         | Application loads previously saved version 1 data correctly.                                                                                     | Pending    | 