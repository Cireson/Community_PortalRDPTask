# Service Manager Portal RDP Task

![RDPTask](/_images/RDPTask.PNG?raw=true "RDP Task")

## Features

- Adds a _Launch RDP_ Task to Incident and Change forms
- Will pull all Affected Configuration Items that are Computers into a drop down list to select from
  - Uses a custom method to check if CIs are Computers to allow for bespoke customisation, eg to allow Hardware Assets of type _Computer_.
- Click OK to launch RDP (mstsc.exe) to that computer
- __Requires__ Cireson App Lanucher community app available from [here](https://downloads.cireson.com "Cireson Downloads")


## Installation

1. Copy the _RDPTask_ folder from the _install_ folder into _CustomSpace_ in your Portal Web Files
2. If this is the first extention you have installed, copy the contents of _Script Loader.js_ to the top of _custom.js_ found in _CustomSpace_ folder
3. Copy the contents of _Add to CustomJS.js_ to the bottom of _custom.js_ found in _CustomSpace_ folder
4. Run the SQL script that is in the _install_ folder against the ServiceManagement database
5. Install the Cireson App Launcher on all Analyst PCs.
6. Refresh the Portal


## Further help

Please log issues on GitHub

Pull requests are welcome

The extention has a thread on the [Cireson Community](https://community.cireson.com/discussion/3222/advanced-searches-for-cireson-service-manager-portal/ "Cireson Community Page").
