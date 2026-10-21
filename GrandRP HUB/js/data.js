/**
 * GrandRP HUB — Law Enforcement & Tactical Protocol Data
 * 
 * Part 1: All Bodycam Commands from rpbodycamcommands.netlify.app
 * Part 2: All Bodycam Commands from grp.trixterpro.in
 * Department Codes: Complete Inter-Agency Radio Communication Directory
 */

export const orgsData = [
  {
    "id": "fib",
    "name": "Federal Investigation Bureau",
    "shortName": "FIB",
    "color": "#f59e0b",
    "glowColor": "rgba(245,159,11,0.4)",
    "sections": [
      {
        "title": "Bodycam Commands (Part 1)",
        "groups": [
          {
            "title": "Attaching Bodycam (Uniform)",
            "commands": [
              {
                "text": "/me Takes out bodycam, attaches it to chest, checks its ballistic, water proof"
              },
              {
                "text": "/me makes sure it is recording and checks for the red light"
              },
              {
                "text": "/do It is recording, is ballistic and water proof"
              },
              {
                "text": "/me connects PDA to the nearest cell tower"
              }
            ]
          },
          {
            "title": "Attaching Bodycam (While Undercover)",
            "commands": [
              {
                "text": "/me takes out bodycam and attaches it to belt, hides it, checks its ballistic and water proof"
              },
              {
                "text": "/me makes sure it is recording and checks for the red light"
              },
              {
                "text": "/do It is recording, is ballistic and water proof"
              },
              {
                "text": "/me connects PDA to the nearest cell tower"
              }
            ]
          },
          {
            "title": "Refreshing Bodycam",
            "commands": [
              {
                "text": "/me refreshing bodycam",
                "note": "First, turn on the bodycam (or screen recording software), then type the command while making sure you are clearly visible in the recording as you do it."
              },
              {
                "text": "/do It is recording"
              }
            ]
          },
          {
            "title": "Saving Bodycam",
            "commands": [
              {
                "text": "/me saves bodycam content to a SD Card, uploads it to the FIB Cloud and continues recording"
              },
              {
                "text": "/do It is recording"
              }
            ]
          },
          {
            "title": "Taking Jumpsuit from Bench",
            "commands": [
              {
                "text": "/me takes the XYZ size Jumpsuit from the Bench",
                "note": "Don't forget to put the actual size that 10-15 has requested instead of XYZ."
              },
              {
                "text": "/me Places the Jumpsuit On the Bed"
              }
            ]
          },
          {
            "title": "Drone Commands (While in Work Uniform)",
            "commands": [
              {
                "text": "/me launches the FIB Drone"
              },
              {
                "text": "/me Takes the FIB Drone from the Ground and put it back in backpack"
              }
            ]
          },
          {
            "title": "Drone Commands (While Undercover)",
            "commands": [
              {
                "text": "/me takes the FIB drone from the trunk and puts it in the backpack"
              },
              {
                "text": "/me takes the FIB drone from the backpack and launches it"
              },
              {
                "text": "/me takes the FIB drone from the ground and puts it in the backpack"
              }
            ]
          },
          {
            "title": "Handing Footage to the Lawyer",
            "commands": [
              {
                "text": "/me saves bodycam contents onto an SD card and uploads contents to FIB servers"
              },
              {
                "text": "/me Takes SD card out of the bodycam and hands it to the lawyer"
              }
            ]
          },
          {
            "title": "Finishing Your Shift",
            "commands": [
              {
                "text": "/me saves bodycam contents onto an SD card and uploads contents to FIB servers"
              },
              {
                "text": "/me puts the badge in the locker"
              }
            ]
          },
          {
            "title": "Searching a Trunk",
            "commands": [
              {
                "text": "/me carefully inspects the trunk and uses a crowbar to attempt opening it"
              },
              {
                "text": "/me applies pressure with the crowbar to force the trunk open"
              }
            ]
          },
          {
            "title": "Taking Evidence — When License Plate Not Visible",
            "commands": [
              {
                "text": "/me feels the edges of the vehicle for VIN and checks for ownership"
              }
            ]
          },
          {
            "title": "Taking Evidence — When License Plate of Bike Not Visible",
            "commands": [
              {
                "text": "/me checks the VIN from the steering neck of the bike and checks for ownership",
                "note": "Then flex G muscle and see the vehicle information."
              }
            ]
          }
        ]
      },
      {
        "title": "Bodycam Commands (Part 2)",
        "groups": [
          {
            "title": "Attaching Bodycam (Uniform)",
            "commands": [
              {
                "text": "/me Takes out bodycam, attaches it to chest, checks its ballistic, water proof"
              },
              {
                "text": "/me makes sure it is recording and checks for the red light"
              },
              {
                "text": "/do It is recording, is ballistic and water proof"
              },
              {
                "text": "/me connects PDA to the nearest cell tower"
              }
            ]
          },
          {
            "title": "While Undercover",
            "commands": [
              {
                "text": "/me takes out bodycam and attaches it to belt, hides it, checks its ballistic and water proof"
              },
              {
                "text": "/me makes sure it is recording and checks for the red light"
              },
              {
                "text": "/do It is recording, is ballistic and water proof"
              },
              {
                "text": "/me connects PDA to the nearest cell tower"
              }
            ]
          },
          {
            "title": "Refreshing Bodycam",
            "commands": [
              {
                "text": "/me refreshing bodycam"
              },
              {
                "text": "/do It is recording"
              }
            ]
          },
          {
            "title": "Saving Bodycam",
            "commands": [
              {
                "text": "/me saves bodycam contents onto an SD card, then uploads it to FIB cloud servers using PDA."
              },
              {
                "text": "/do Bodycam refreshes and continues recording."
              }
            ]
          },
          {
            "title": "Taking Jumpsuit from Bench",
            "commands": [
              {
                "text": "/me takes the XYZ size Jumpsuit from the Bench",
                "note": "Replace XYZ with the actual size requested by 10-15."
              },
              {
                "text": "/me Places the Jumpsuit On the Bed"
              }
            ]
          },
          {
            "title": "Drone Commands (Uniform)",
            "commands": [
              {
                "text": "/me launches the FIB Drone"
              },
              {
                "text": "/me Takes the FIB Drone from the Ground and put it back in backpack"
              }
            ]
          },
          {
            "title": "Drone Commands (Undercover)",
            "commands": [
              {
                "text": "/me takes the FIB drone from the trunk and puts it in the backpack"
              },
              {
                "text": "/me takes the FIB drone from the backpack and launches it"
              },
              {
                "text": "/me takes the FIB drone from the ground and puts it in the backpack"
              }
            ]
          },
          {
            "title": "Searching a Trunk",
            "commands": [
              {
                "text": "/me carefully inspects the trunk and uses a crowbar to attempt opening it"
              },
              {
                "text": "/me applies pressure with the crowbar to force the trunk open"
              }
            ]
          },
          {
            "title": "Taking Evidence",
            "commands": [
              {
                "text": "/me feels the edges of the vehicle for VIN and checks for ownership",
                "note": "When license plate not visible on car."
              },
              {
                "text": "/me checks the VIN from the steering neck of the bike and checks for ownership",
                "note": "When license plate not visible on bike."
              }
            ]
          },
          {
            "title": "Handing Footage to the Lawyer",
            "commands": [
              {
                "text": "/me saves bodycam contents onto an SD card and uploads contents to FIB servers"
              },
              {
                "text": "/me Takes SD card out of the bodycam and hands it to the lawyer"
              }
            ]
          },
          {
            "title": "Finishing Your Shift",
            "commands": [
              {
                "text": "/me saves bodycam contents onto an SD card and uploads contents to FIB servers"
              },
              {
                "text": "/me puts the badge in the locker"
              }
            ]
          }
        ]
      },
      {
        "title": "Department Codes & Messages",
        "groups": [
          {
            "title": "FIB to LSPD",
            "commands": [
              {
                "text": "FIB to LSPD: How copy?"
              },
              {
                "text": "FIB to LSPD: Good copy, send traffic!"
              },
              {
                "text": "FIB to LSPD: Bad copy!"
              },
              {
                "text": "FIB to LSPD: Bad copy, we're currently in a situation!"
              },
              {
                "text": "FIB to LSPD: Can we have a quick meeting at your HQ?"
              },
              {
                "text": "FIB to LSPD: Requesting permission to land at your helipad."
              },
              {
                "text": "FIB to LSPD: We are entering your jurisdiction in chase of a car hijacker, help would be appreciated."
              },
              {
                "text": "FIB to LSPD: We have one of your units in custody, could you 10-17 to DOC?"
              },
              {
                "text": "FIB to LSPD: We're currently enroute!"
              },
              {
                "text": "FIB to LSPD: 10-4, much appreciated!"
              },
              {
                "text": "FIB to LSPD: Permission Granted!"
              }
            ]
          },
          {
            "title": "FIB to SAHP",
            "commands": [
              {
                "text": "FIB to SAHP: How Copy?"
              },
              {
                "text": "FIB to SAHP: Good copy, send traffic!"
              },
              {
                "text": "FIB to SAHP: Bad copy!"
              },
              {
                "text": "FIB to SAHP: Bad copy, we're currently in a situation!"
              },
              {
                "text": "FIB to SAHP: Can we have a quick meeting at your hall?"
              },
              {
                "text": "FIB to SAHP: Requesting permission to land at your helipad."
              },
              {
                "text": "FIB to SAHP: We have one of your agents in custody, could you 10-17 to DOC?"
              },
              {
                "text": "FIB to SAHP: We are entering your jurisdiction in chase of a car hijacker, help would be appreciated."
              },
              {
                "text": "FIB to SAHP: Troopers enroute!"
              },
              {
                "text": "FIB to SAHP: 10-4, much appreciated!"
              },
              {
                "text": "FIB to SAHP: Permission Granted!"
              }
            ]
          },
          {
            "title": "FIB to NG",
            "commands": [
              {
                "text": "FIB to NG: How copy?"
              },
              {
                "text": "FIB to NG: Good copy, send traffic!"
              },
              {
                "text": "FIB to NG: Bad copy!"
              },
              {
                "text": "FIB to NG: Bad copy, we're currently in a situation!"
              },
              {
                "text": "FIB to NG: Can we have quick meeting at your main barracks?"
              },
              {
                "text": "FIB to NG: Requesting permission to land at your main barracks."
              },
              {
                "text": "FIB to NG: We have one of your soldiers in custody, could you 10-17 to DOC?"
              },
              {
                "text": "FIB to NG: We're currently enroute!"
              },
              {
                "text": "FIB to NG: We are entering your Base in chase of a car hijacker, help would be appreciated."
              },
              {
                "text": "FIB to NG: 10-4, much appreciated!"
              },
              {
                "text": "FIB to NG: Permission Granted!"
              }
            ]
          },
          {
            "title": "FIB to GOV",
            "commands": [
              {
                "text": "FIB to GOV: How copy?"
              },
              {
                "text": "FIB to GOV: Good copy, send traffic!"
              },
              {
                "text": "FIB to GOV: Bad copy!"
              },
              {
                "text": "FIB to GOV: Bad copy, we're currently in a situation!"
              },
              {
                "text": "FIB to GOV: Agents enroute!"
              },
              {
                "text": "FIB to GOV: Can we have a quick meeting at capitol?"
              },
              {
                "text": "FIB to GOV: Requesting permission to land on your lawn."
              },
              {
                "text": "FIB to GOV: We have one of your units in custody, could you 10-17 to DOC?"
              },
              {
                "text": "FIB to GOV: 10-4, much appreciated!"
              }
            ]
          },
          {
            "title": "FIB to DOJ",
            "commands": [
              {
                "text": "FIB to DOJ: How copy?"
              },
              {
                "text": "FIB to DOJ: Good copy, send traffic!"
              },
              {
                "text": "FIB to DOJ: Bad copy!"
              },
              {
                "text": "FIB to DOJ: Bad copy, we're currently in a situation!"
              },
              {
                "text": "FIB to DOJ: We have a 10-15 at DOC requesting a lawyer, Are there any available?"
              },
              {
                "text": "FIB to DOJ: 10-4, much appreciated!"
              },
              {
                "text": "FIB to DOJ: 10-4, Waiting for your Arrival!"
              }
            ]
          },
          {
            "title": "FIB to EMS",
            "commands": [
              {
                "text": "FIB to EMS: How copy?"
              },
              {
                "text": "FIB to EMS: Good copy, send traffic!"
              },
              {
                "text": "FIB to EMS: Bad copy!"
              },
              {
                "text": "FIB to EMS: Bad copy, we're currently in a situation!"
              },
              {
                "text": "FIB to EMS: Ghetto is off limits for the next 25 minutes, please inform all your units."
              },
              {
                "text": "FIB to EMS: Can we have a quick meeting at Pillbox Hospital?"
              },
              {
                "text": "FIB to EMS: Requesting permission to land at your helipad."
              },
              {
                "text": "FIB to EMS: We have one of your employees in custody, could you 10-17 to DOC?"
              },
              {
                "text": "FIB to EMS: We're currently enroute!"
              },
              {
                "text": "FIB to EMS: Clean!"
              },
              {
                "text": "FIB to EMS: 10-4, much appreciated!"
              },
              {
                "text": "FIB to EMS: Permission Granted!"
              }
            ]
          },
          {
            "title": "FIB to GLOBAL",
            "commands": [
              {
                "text": "FIB to GLOBAL: What's the situation?"
              },
              {
                "text": "FIB to ALL: Global is for Regroupping for latest Store Robbery. Please Dispatch Max units"
              },
              {
                "text": "FIB to ALL: Global is for heavy 10-10s, send all available units!"
              },
              {
                "text": "FIB to ALL: Federals is getting robbed at global, send all available units!"
              },
              {
                "text": "FIB to ALL: Global is for a hood watch, send all available units!"
              },
              {
                "text": "FIB to ALL: Global is for a checkpoint, everyone is invited!"
              },
              {
                "text": "FIB to ALL: Be on standby for a possible hostage situation!"
              },
              {
                "text": "FIB to ALL: The Global is 10-99."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "gov",
    "name": "Government",
    "shortName": "GOV",
    "color": "#a855f7",
    "glowColor": "rgba(168,85,247,0.4)",
    "sections": [
      {
        "title": "Bodycam Commands (Part 1)",
        "groups": [
          {
            "title": "Attaching Bodycam (Uniform)",
            "commands": [
              {
                "text": "/me Takes out bodycam, attaches it to chest, checks its ballistic, water proof"
              },
              {
                "text": "/me makes sure it is recording and checks for the red light"
              },
              {
                "text": "/do It is recording, is ballistic and water proof"
              },
              {
                "text": "/me connects PDA to the nearest cell tower"
              }
            ]
          },
          {
            "title": "Refreshing Bodycam",
            "commands": [
              {
                "text": "/me refreshing bodycam",
                "note": "First, turn on the bodycam (or screen recording software), then type the command while ensuring you are clearly visible in the recording."
              },
              {
                "text": "/do It is recording"
              }
            ]
          },
          {
            "title": "Saving Bodycam",
            "commands": [
              {
                "text": "/me saves bodycam content to a SD Card, uploads it to the GOV Cloud and continues recording"
              },
              {
                "text": "/do It is recording"
              }
            ]
          },
          {
            "title": "Lawyer Commands",
            "commands": [
              {
                "text": "/me hands over the defence contract to XXX with a pen",
                "note": "Don't forget to replace XXX with the name of Client/10-15."
              },
              {
                "text": "/me Hands over the Bail and Parole contract to XXX with a pen"
              },
              {
                "text": "/me takes the USB/SD from Officer/Agent XXX"
              }
            ]
          },
          {
            "title": "Handing Footage to the Lawyer",
            "commands": [
              {
                "text": "/me saves bodycam contents onto an SD card and uploads contents to GOV servers"
              },
              {
                "text": "/me Takes SD card out of the bodycam and hands it to the lawyer"
              }
            ]
          },
          {
            "title": "Finishing Your Shift",
            "commands": [
              {
                "text": "/me saves bodycam contents onto an SD card and uploads contents to GOV servers"
              },
              {
                "text": "/me puts the badge in the locker"
              }
            ]
          }
        ]
      },
      {
        "title": "Bodycam Commands (Part 2)",
        "groups": [
          {
            "title": "Attaching Bodycam (Uniform)",
            "commands": [
              {
                "text": "/me Takes out bodycam, attaches it to chest, checks its ballistic, water proof"
              },
              {
                "text": "/me makes sure it is recording and checks for the red light"
              },
              {
                "text": "/do It is recording, is ballistic and water proof"
              },
              {
                "text": "/me connects PDA to the nearest cell tower"
              }
            ]
          },
          {
            "title": "Refreshing Bodycam",
            "commands": [
              {
                "text": "/me refreshing bodycam"
              },
              {
                "text": "/do It is recording"
              }
            ]
          },
          {
            "title": "Saving Bodycam",
            "commands": [
              {
                "text": "/me saves bodycam contents onto an SD card, then uploads it to GOV cloud servers using PDA."
              },
              {
                "text": "/do Bodycam refreshes and continues recording."
              }
            ]
          },
          {
            "title": "Lawyer Commands",
            "commands": [
              {
                "text": "/me hands over the defence contract to XXX with a pen",
                "note": "Replace XXX with the name of Client/10-15."
              },
              {
                "text": "/me Hands over the Bail and Parole contract to XXX with a pen",
                "note": "Replace XXX with the name of Client/10-15."
              },
              {
                "text": "/me takes the USB/SD from Officer/Agent XXX",
                "note": "Replace XXX with the name of Client/10-15."
              }
            ]
          },
          {
            "title": "Handing Footage to the Lawyer",
            "commands": [
              {
                "text": "/me saves bodycam contents onto an SD card and uploads contents to GOV servers"
              },
              {
                "text": "/me Takes SD card out of the bodycam and hands it to the lawyer"
              }
            ]
          },
          {
            "title": "Finishing Your Shift",
            "commands": [
              {
                "text": "/me saves bodycam contents onto an SD card and uploads contents to GOV servers"
              },
              {
                "text": "/me puts the badge in the locker"
              }
            ]
          }
        ]
      },
      {
        "title": "Department Codes & Messages",
        "groups": [
          {
            "title": "GOV to FIB",
            "commands": [
              {
                "text": "GOV To FIB: How copy?"
              },
              {
                "text": "GOV To FIB: Good copy, send traffic!"
              },
              {
                "text": "GOV To FIB: Bad copy!"
              },
              {
                "text": "GOV To FIB: Bad copy, we're currently in a situation!"
              },
              {
                "text": "GOV To FIB: Can we have a quick meeting at Capitols?"
              },
              {
                "text": "GOV to FIB: Requesting permission to land at your helipad."
              },
              {
                "text": "GOV To FIB: Agents enroute!"
              },
              {
                "text": "GOV To FIB: Requesting permission to land on your lawn."
              },
              {
                "text": "GOV To FIB: We have one of your units in custody, could you 10-17 to DOC?"
              },
              {
                "text": "GOV To FIB: 10-4, much appreciated!"
              }
            ]
          },
          {
            "title": "GOV to LSPD",
            "commands": [
              {
                "text": "GOV to LSPD: How copy?"
              },
              {
                "text": "GOV to LSPD: Good copy, send traffic!"
              },
              {
                "text": "GOV to LSPD: Bad copy!"
              },
              {
                "text": "GOV to LSPD: Bad copy, we're currently in a situation!"
              },
              {
                "text": "GOV to LSPD: Can we have a quick meeting at Capitols?"
              },
              {
                "text": "GOV to LSPD: Requesting permission to land at your helipad."
              },
              {
                "text": "GOV to LSPD: We have one of your units in custody, could you 10-17 to DOC?"
              },
              {
                "text": "GOV to LSPD: We're currently enroute!"
              },
              {
                "text": "GOV to LSPD: 10-4, much appreciated!"
              },
              {
                "text": "GOV to LSPD: Permission Granted!"
              }
            ]
          },
          {
            "title": "GOV to SAHP",
            "commands": [
              {
                "text": "GOV to SAHP: Good copy, send traffic!"
              },
              {
                "text": "GOV to SAHP: Bad copy!"
              },
              {
                "text": "GOV to SAHP: Bad copy, we're currently in a situation!"
              },
              {
                "text": "GOV to SAHP: Can we have a quick meeting at your hall?"
              },
              {
                "text": "GOV to SAHP: Requesting permission to land at your helipad."
              },
              {
                "text": "GOV to SAHP: We have one of your agents in custody, could you 10-17 to DOC?"
              },
              {
                "text": "GOV to SAHP: We're currently enroute!"
              },
              {
                "text": "GOV to SAHP: Troopers enroute!"
              },
              {
                "text": "GOV to SAHP: 10-4, much appreciated!"
              },
              {
                "text": "GOV to SAHP: Permission Granted!"
              }
            ]
          },
          {
            "title": "GOV to NG",
            "commands": [
              {
                "text": "GOV to NG: How copy?"
              },
              {
                "text": "GOV to NG: Good copy, send traffic!"
              },
              {
                "text": "GOV to NG: Bad copy!"
              },
              {
                "text": "GOV to NG: Bad copy, we're currently in a situation!"
              },
              {
                "text": "GOV to NG: Can we have a quick meeting at your main barracks?"
              },
              {
                "text": "GOV to NG: Requesting permission to land at your main barracks."
              },
              {
                "text": "GOV to NG: We have one of your soldiers in custody, could you 10-17 to DOC?"
              },
              {
                "text": "GOV to NG: We're currently enroute!"
              },
              {
                "text": "GOV to NG: 10-4, much appreciated!"
              },
              {
                "text": "GOV to NG: Permission Granted!"
              }
            ]
          },
          {
            "title": "GOV to EMS",
            "commands": [
              {
                "text": "GOV to EMS: How copy?"
              },
              {
                "text": "GOV to EMS: Good copy, send traffic!"
              },
              {
                "text": "GOV to EMS: Bad copy!"
              },
              {
                "text": "GOV to EMS: Bad copy, we're currently in a situation!"
              },
              {
                "text": "GOV to EMS: Ghetto is off limits for the next 25 minutes, please inform all your units."
              },
              {
                "text": "GOV to EMS: Can we have a quick meeting at Pillbox Hospital?"
              },
              {
                "text": "GOV to EMS: Requesting permission to land at your helipad."
              },
              {
                "text": "GOV to EMS: We have one of your employees in custody, could you 10-17 to DOC?"
              },
              {
                "text": "GOV to EMS: We're currently enroute!"
              },
              {
                "text": "GOV to EMS: Clean!"
              },
              {
                "text": "GOV to EMS: 10-4, much appreciated!"
              },
              {
                "text": "GOV to EMS: Permission Granted!"
              }
            ]
          },
          {
            "title": "GOV to GLOBAL",
            "commands": [
              {
                "text": "GOV to GLOBAL: What's the situation?"
              },
              {
                "text": "GOV to ALL: Global is for Regroupping for latest Store Robbery. Please Dispatch Max units"
              },
              {
                "text": "GOV to ALL: Global is for heavy 10-10s, send all available units!"
              },
              {
                "text": "GOV to ALL: Federals is getting robbed at global, send all available units!"
              },
              {
                "text": "GOV to ALL: Global is for a hood watch, send all available units!"
              },
              {
                "text": "GOV to ALL: Global is for a checkpoint, everyone is invited!"
              },
              {
                "text": "GOV to ALL: Be on standby for a possible hostage situation!"
              },
              {
                "text": "GOV to ALL: The Global is 10-99."
              }
            ]
          },
          {
            "title": "DOJ to Others",
            "commands": [
              {
                "text": "DOJ To FIB: How copy?"
              },
              {
                "text": "DOJ To LSPD: How copy?"
              },
              {
                "text": "DOJ To SAHP: How copy?"
              },
              {
                "text": "DOJ To EMS: How copy?"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "lspd",
    "name": "Los Santos Police Department",
    "shortName": "LSPD",
    "color": "#3b82f6",
    "glowColor": "rgba(59,130,246,0.4)",
    "sections": [
      {
        "title": "Bodycam Commands (Part 1)",
        "groups": [
          {
            "title": "Attaching Bodycam (Uniform)",
            "commands": [
              {
                "text": "/me Takes out bodycam, attaches it to chest, checks its ballistic, water proof"
              },
              {
                "text": "/me makes sure it is recording and checks for the red light"
              },
              {
                "text": "/do It is recording, is ballistic and water proof"
              },
              {
                "text": "/me connects PDA to the nearest cell tower"
              }
            ]
          },
          {
            "title": "Attaching Bodycam (While Undercover)",
            "commands": [
              {
                "text": "/me takes out bodycam and attaches it to belt, hides it, checks its ballistic and water proof"
              },
              {
                "text": "/me makes sure it is recording and checks for the red light"
              },
              {
                "text": "/do It is recording, is ballistic and water proof"
              },
              {
                "text": "/me connects PDA to the nearest cell tower"
              }
            ]
          },
          {
            "title": "Refreshing Bodycam",
            "commands": [
              {
                "text": "/me refreshing bodycam"
              },
              {
                "text": "/do It is recording"
              }
            ]
          },
          {
            "title": "Saving Bodycam",
            "commands": [
              {
                "text": "/me saves bodycam content to a SD Card, uploads it to the LSPD Cloud and continues recording"
              },
              {
                "text": "/do It is recording"
              }
            ]
          },
          {
            "title": "Drone Commands (While in Work Uniform)",
            "commands": [
              {
                "text": "/me launches the LSPD Drone"
              }
            ]
          },
          {
            "title": "Drone Commands (While Undercover)",
            "commands": [
              {
                "text": "/me takes the LSPD drone from the trunk and puts it in the backpack"
              },
              {
                "text": "/me takes the LSPD drone from the backpack and launches it"
              },
              {
                "text": "/me takes the LSPD drone from the ground and puts it in the backpack"
              }
            ]
          },
          {
            "title": "Breaking the Trunk",
            "commands": [
              {
                "text": "/me carefully inspects the trunk and uses a crowbar to attempt opening it"
              },
              {
                "text": "/me applies pressure with the crowbar to force the trunk open"
              }
            ]
          },
          {
            "title": "Taking Jumpsuit from Bench",
            "commands": [
              {
                "text": "/me takes the XYZ size Jumpsuit from the Bench",
                "note": "Don't forget to put the actual size that 10-15 has requested instead of XYZ."
              },
              {
                "text": "/me Places the Jumpsuit on the Bed"
              }
            ]
          },
          {
            "title": "Handing Footage to the Lawyer",
            "commands": [
              {
                "text": "/me saves bodycam contents onto an SD card and uploads contents to LSPD servers"
              },
              {
                "text": "/me Takes SD card out of the bodycam and hands it to the lawyer"
              }
            ]
          },
          {
            "title": "Finishing Your Shift",
            "commands": [
              {
                "text": "/me saves bodycam contents onto an SD card and uploads contents to LSPD servers"
              },
              {
                "text": "/me puts the badge in the locker"
              }
            ]
          },
          {
            "title": "Searching a Trunk",
            "commands": [
              {
                "text": "/me carefully inspects the trunk and uses a crowbar to attempt opening it"
              },
              {
                "text": "/me applies pressure with the crowbar to force the trunk open"
              }
            ]
          },
          {
            "title": "Taking Evidence — When License Plate Not Visible of Car",
            "commands": [
              {
                "text": "/me feels the edges of the vehicle for VIN and checks for ownership"
              }
            ]
          },
          {
            "title": "Taking Evidence — When License Plate Not Visible of Bike",
            "commands": [
              {
                "text": "/me checks the VIN from the steering neck of the bike and checks for ownership",
                "note": "Then press G on vehicle and view vehicle information."
              }
            ]
          }
        ]
      },
      {
        "title": "Bodycam Commands (Part 2)",
        "groups": [
          {
            "title": "Attaching Bodycam (Uniform)",
            "commands": [
              {
                "text": "/me Takes out bodycam, attaches it to chest, checks its ballistic, water proof"
              },
              {
                "text": "/me makes sure it is recording and checks for the red light"
              },
              {
                "text": "/do It is recording, is ballistic and water proof"
              },
              {
                "text": "/me connects PDA to the nearest cell tower"
              }
            ]
          },
          {
            "title": "While Undercover",
            "commands": [
              {
                "text": "/me takes out bodycam and attaches it to belt, hides it, checks its ballistic and water proof"
              },
              {
                "text": "/me makes sure it is recording and checks for the red light"
              },
              {
                "text": "/do It is recording, is ballistic and water proof"
              },
              {
                "text": "/me connects PDA to the nearest cell tower"
              }
            ]
          },
          {
            "title": "Refreshing Bodycam",
            "commands": [
              {
                "text": "/me refreshing bodycam"
              },
              {
                "text": "/do It is recording"
              }
            ]
          },
          {
            "title": "Saving Bodycam",
            "commands": [
              {
                "text": "/me saves bodycam contents onto an SD card, then uploads it to LSPD cloud servers using PDA."
              },
              {
                "text": "/do Bodycam refreshes and continues recording."
              }
            ]
          },
          {
            "title": "Drone Commands (Uniform)",
            "commands": [
              {
                "text": "/me launches the LSPD Drone"
              }
            ]
          },
          {
            "title": "Drone Commands (Undercover)",
            "commands": [
              {
                "text": "/me takes the LSPD drone from the trunk and puts it in the backpack"
              },
              {
                "text": "/me takes the LSPD drone from the backpack and launches it"
              },
              {
                "text": "/me takes the LSPD drone from the ground and puts it in the backpack"
              }
            ]
          },
          {
            "title": "Breaking the Trunk",
            "commands": [
              {
                "text": "/me carefully inspects the trunk and uses a crowbar to attempt opening it"
              },
              {
                "text": "/me applies pressure with the crowbar to force the trunk open"
              }
            ]
          },
          {
            "title": "Taking Jumpsuit from Bench",
            "commands": [
              {
                "text": "/me takes the XYZ size Jumpsuit from the Bench",
                "note": "Replace XYZ with the actual size requested by 10-15."
              },
              {
                "text": "/me Places the Jumpsuit on the Bed"
              }
            ]
          },
          {
            "title": "Handing Footage to the Lawyer",
            "commands": [
              {
                "text": "/me saves bodycam contents onto an SD card and uploads contents to LSPD servers"
              },
              {
                "text": "/me Takes SD card out of the bodycam and hands it to the lawyer"
              }
            ]
          },
          {
            "title": "Finishing Your Shift",
            "commands": [
              {
                "text": "/me saves bodycam contents onto an SD card and uploads contents to LSPD servers"
              },
              {
                "text": "/me puts the badge in the locker"
              }
            ]
          },
          {
            "title": "Searching a Trunk",
            "commands": [
              {
                "text": "/me carefully inspects the trunk and uses a crowbar to attempt opening it"
              },
              {
                "text": "/me applies pressure with the crowbar to force the trunk open"
              }
            ]
          },
          {
            "title": "Taking Evidence",
            "commands": [
              {
                "text": "/me feels the edges of the vehicle for VIN and checks for ownership",
                "note": "When license plate not visible on car."
              },
              {
                "text": "/me checks the VIN from the steering neck of the bike and checks for ownership",
                "note": "When license plate not visible on bike."
              }
            ]
          }
        ]
      },
      {
        "title": "Department Codes & Messages",
        "groups": [
          {
            "title": "LSPD to DOJ",
            "commands": [
              {
                "text": "LSPD To DOJ: How copy?"
              },
              {
                "text": "LSPD to DOJ: Good copy, send traffic!"
              },
              {
                "text": "LSPD to DOJ: Bad copy!"
              },
              {
                "text": "LSPD to DOJ: Bad copy, we're currently in a situation!"
              },
              {
                "text": "LSPD to DOJ: We have a 10-15 at DOC requesting a lawyer, Are there any available?"
              },
              {
                "text": "LSPD to DOJ: 10-4, much appreciated!"
              }
            ]
          },
          {
            "title": "LSPD to FIB",
            "commands": [
              {
                "text": "LSPD To FIB: How copy?"
              },
              {
                "text": "LSPD To FIB: Good copy, send traffic!"
              },
              {
                "text": "LSPD To FIB: Bad copy!"
              },
              {
                "text": "LSPD To FIB: Bad copy, we're currently in a situation!"
              },
              {
                "text": "LSPD To FIB: Can we have a quick meeting at your HQ?"
              },
              {
                "text": "LSPD To FIB: Requesting permission to land at your helipad."
              },
              {
                "text": "LSPD To FIB: We are entering your jurisdiction in chase of a car hijacker, help would be appreciated."
              },
              {
                "text": "LSPD To FIB: We have one of your units in custody, could you 10-17 to DOC?"
              },
              {
                "text": "LSPD To FIB: We're currently enroute!"
              },
              {
                "text": "LSPD To FIB: 10-4, much appreciated!"
              },
              {
                "text": "LSPD To FIB: Permission Granted!"
              }
            ]
          },
          {
            "title": "LSPD to SAHP",
            "commands": [
              {
                "text": "LSPD to SAHP: Good copy, send traffic!"
              },
              {
                "text": "LSPD to SAHP: Bad copy!"
              },
              {
                "text": "LSPD to SAHP: Bad copy, we're currently in a situation!"
              },
              {
                "text": "LSPD to SAHP: Can we have a quick meeting at your hall?"
              },
              {
                "text": "LSPD to SAHP: Requesting permission to land at your helipad."
              },
              {
                "text": "LSPD to SAHP: We have one of your agents in custody, could you 10-17 to DOC?"
              },
              {
                "text": "LSPD to SAHP: We're currently enroute!"
              },
              {
                "text": "LSPD to SAHP: Troopers enroute!"
              },
              {
                "text": "LSPD to SAHP: 10-4, much appreciated!"
              },
              {
                "text": "LSPD to SAHP: Permission Granted!"
              }
            ]
          },
          {
            "title": "LSPD to NG",
            "commands": [
              {
                "text": "LSPD to NG: How copy?"
              },
              {
                "text": "LSPD to NG: Good copy, send traffic!"
              },
              {
                "text": "LSPD to NG: Bad copy!"
              },
              {
                "text": "LSPD to NG: Bad copy, we're currently in a situation!"
              },
              {
                "text": "LSPD to NG: Can we have a quick meeting at your main barracks?"
              },
              {
                "text": "LSPD to NG: Requesting permission to land at your main barracks."
              },
              {
                "text": "LSPD to NG: We have one of your soldiers in custody, could you 10-17 to DOC?"
              },
              {
                "text": "LSPD to NG: We're currently enroute!"
              },
              {
                "text": "LSPD to NG: 10-4, much appreciated!"
              },
              {
                "text": "LSPD to NG: Permission Granted!"
              }
            ]
          },
          {
            "title": "LSPD to EMS",
            "commands": [
              {
                "text": "LSPD to EMS: How copy?"
              },
              {
                "text": "LSPD to EMS: Good copy, send traffic!"
              },
              {
                "text": "LSPD to EMS: Bad copy!"
              },
              {
                "text": "LSPD to EMS: Bad copy, we're currently in a situation!"
              },
              {
                "text": "LSPD to EMS: Ghetto is off limits for the next 25 minutes, please inform all your units."
              },
              {
                "text": "LSPD to EMS: Can we have a quick meeting at Pillbox Hospital?"
              },
              {
                "text": "LSPD to EMS: Requesting permission to land at your helipad."
              },
              {
                "text": "LSPD to EMS: We have one of your employees in custody, could you 10-17 to DOC?"
              },
              {
                "text": "LSPD to EMS: We're currently enroute!"
              },
              {
                "text": "LSPD to EMS: Clean!"
              },
              {
                "text": "LSPD to EMS: 10-4, much appreciated!"
              },
              {
                "text": "LSPD to EMS: Permission Granted!"
              }
            ]
          },
          {
            "title": "LSPD to GOV",
            "commands": [
              {
                "text": "LSPD to GOV: How copy?"
              },
              {
                "text": "LSPD to GOV: Good copy, send traffic!"
              },
              {
                "text": "LSPD to GOV: Bad copy!"
              },
              {
                "text": "LSPD to GOV: Bad copy, we're currently in a situation!"
              },
              {
                "text": "LSPD to GOV: Agents enroute!"
              },
              {
                "text": "LSPD to GOV: Can we have a quick meeting at capitol?"
              },
              {
                "text": "LSPD to GOV: Requesting permission to land on your lawn."
              },
              {
                "text": "LSPD to GOV: We have one of your units in custody, could you 10-17 to DOC?"
              },
              {
                "text": "LSPD to GOV: 10-4, much appreciated!"
              }
            ]
          },
          {
            "title": "LSPD to GLOBAL",
            "commands": [
              {
                "text": "LSPD to GLOBAL: What's the situation?"
              },
              {
                "text": "LSPD to ALL: Global is for regrouping for latest store robbery. Please dispatch max units"
              },
              {
                "text": "LSPD to ALL: Global is for heavy 10-10s, send all available units!"
              },
              {
                "text": "LSPD to ALL: Federals is getting robbed at global, send all available units!"
              },
              {
                "text": "LSPD to ALL: Global is for a hood watch, send all available units!"
              },
              {
                "text": "LSPD to ALL: Global is for a checkpoint, everyone is invited!"
              },
              {
                "text": "LSPD to ALL: Be on standby for a possible hostage situation!"
              },
              {
                "text": "LSPD to ALL: The Global is 10-99."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "sahp",
    "name": "San Andreas Highway Patrol",
    "shortName": "SAHP",
    "color": "#d4a017",
    "glowColor": "rgba(212,160,23,0.4)",
    "sections": [
      {
        "title": "Bodycam Commands (Part 1)",
        "groups": [
          {
            "title": "Attaching Bodycam — In Uniform",
            "commands": [
              {
                "text": "/me Takes out bodycam, attaches it to chest, checks its ballistic and waterproof"
              },
              {
                "text": "/me ensures it is recording and checks for the red light"
              },
              {
                "text": "/do It is recording, is ballistic and waterproof"
              },
              {
                "text": "/me connects the PDA to the nearby SAHP cell tower and cloud servers"
              }
            ]
          },
          {
            "title": "Attaching Bodycam (While Undercover)",
            "commands": [
              {
                "text": "/me takes out bodycam and attaches it to belt, hides it, checks its ballistic and waterproof"
              },
              {
                "text": "/me makes sure it is recording and checks for the red light"
              },
              {
                "text": "/do It is recording, is ballistic and waterproof"
              },
              {
                "text": "/me connects PDA to the nearest cell tower"
              }
            ]
          },
          {
            "title": "Refreshing Bodycam",
            "commands": [
              {
                "text": "/me refreshing bodycam",
                "note": "First, turn on the bodycam (or screen recording software), then type the command while making sure you are clearly visible in the recording as you do it."
              },
              {
                "text": "/do It is recording"
              }
            ]
          },
          {
            "title": "Saving Bodycam",
            "commands": [
              {
                "text": "/me saves bodycam content to a SD Card, uploads it to the SAHP Cloud and continues recording"
              },
              {
                "text": "/do It is recording"
              }
            ]
          },
          {
            "title": "Jumpsuit Commands — Taking Jumpsuit",
            "commands": [
              {
                "text": "/me takes the XYZ Size Jumpsuit From the Bench",
                "note": "Don't forget to swap XYZ with the actual size of jumpsuit requested by 10-15."
              }
            ]
          },
          {
            "title": "Jumpsuit Commands — Placing On Bed",
            "commands": [
              {
                "text": "/me Places the Jumpsuit on the Bed"
              }
            ]
          },
          {
            "title": "Drone Commands (While in Work Uniform)",
            "commands": [
              {
                "text": "/me launches the SAHP Drone"
              }
            ]
          },
          {
            "title": "Drone Commands (While Undercover)",
            "commands": [
              {
                "text": "/me takes the SAHP drone from the trunk and puts it in the backpack"
              },
              {
                "text": "/me takes the SAHP drone from the backpack and launches it"
              },
              {
                "text": "/me takes the SAHP drone from the ground and puts it in the backpack"
              }
            ]
          },
          {
            "title": "Breaking Trunk of Vehicle — Breaking the Trunk",
            "commands": [
              {
                "text": "/me Break the trunk wide open using a crowbar"
              },
              {
                "text": "/me writes down license plate and searches the license plate through the SAHP database"
              },
              {
                "text": "/me Kneels down, feels the VIN number under the car and run it through SAHP Database"
              }
            ]
          },
          {
            "title": "Handing Footage to the Lawyer",
            "commands": [
              {
                "text": "/me saves bodycam footage onto an SD card and uploads to SAHP servers"
              },
              {
                "text": "/me removes SD card from bodycam and hands it to the lawyer"
              }
            ]
          },
          {
            "title": "Finishing Your Shift",
            "commands": [
              {
                "text": "/me saves bodycam footage onto an SD card and uploads to SAHP servers"
              },
              {
                "text": "/me stores badge and equipment in the locker"
              }
            ]
          }
        ]
      },
      {
        "title": "Bodycam Commands (Part 2)",
        "groups": [
          {
            "title": "Attaching Bodycam (Uniform)",
            "commands": [
              {
                "text": "/me Takes out bodycam, attaches it to chest, checks its ballistic and waterproof"
              },
              {
                "text": "/me ensures it is recording and checks for the red light"
              },
              {
                "text": "/do It is recording, is ballistic and waterproof"
              },
              {
                "text": "/me connects the PDA to the nearby SAHP cell tower and cloud servers"
              }
            ]
          },
          {
            "title": "While Undercover",
            "commands": [
              {
                "text": "/me takes out bodycam and attaches it to belt, hides it, checks its ballistic and waterproof"
              },
              {
                "text": "/me makes sure it is recording and checks for the red light"
              },
              {
                "text": "/do It is recording, is ballistic and waterproof"
              },
              {
                "text": "/me connects PDA to the nearest cell tower"
              }
            ]
          },
          {
            "title": "Refreshing Bodycam",
            "commands": [
              {
                "text": "/me refreshing bodycam"
              },
              {
                "text": "/do It is recording"
              }
            ]
          },
          {
            "title": "Saving Bodycam",
            "commands": [
              {
                "text": "/me saves bodycam contents onto an SD card, then uploads it to SAHP cloud servers using PDA."
              },
              {
                "text": "/do Bodycam refreshes and continues recording."
              }
            ]
          },
          {
            "title": "Jumpsuit Commands",
            "commands": [
              {
                "text": "/me takes the XYZ Size Jumpsuit From the Bench",
                "note": "Swap XYZ with the actual size requested by 10-15."
              },
              {
                "text": "/me Places the Jumpsuit on the Bed"
              }
            ]
          },
          {
            "title": "Drone Commands (Uniform)",
            "commands": [
              {
                "text": "/me launches the SAHP Drone"
              }
            ]
          },
          {
            "title": "Drone Commands (Undercover)",
            "commands": [
              {
                "text": "/me takes the SAHP drone from the trunk and puts it in the backpack"
              },
              {
                "text": "/me takes the SAHP drone from the backpack and launches it"
              },
              {
                "text": "/me takes the SAHP drone from the ground and puts it in the backpack"
              }
            ]
          },
          {
            "title": "Breaking Trunk of Vehicle",
            "commands": [
              {
                "text": "/me Break the trunk wide open using a crowbar"
              },
              {
                "text": "/me writes down license plate and searches the license plate through the SAHP database"
              },
              {
                "text": "/me Kneels down, feels the VIN number under the car and run it through SAHP Database"
              }
            ]
          },
          {
            "title": "Handing Footage to the Lawyer",
            "commands": [
              {
                "text": "/me saves bodycam footage onto an SD card and uploads to SAHP servers"
              },
              {
                "text": "/me removes SD card from bodycam and hands it to the lawyer"
              }
            ]
          },
          {
            "title": "Finishing Your Shift",
            "commands": [
              {
                "text": "/me saves bodycam footage onto an SD card and uploads to SAHP servers"
              },
              {
                "text": "/me stores badge and equipment in the locker"
              }
            ]
          }
        ]
      },
      {
        "title": "Department Codes & Messages",
        "groups": [
          {
            "title": "SAHP to DOJ",
            "commands": [
              {
                "text": "SAHP to DOJ: How copy?"
              },
              {
                "text": "SAHP to DOJ: Good copy, send traffic!"
              },
              {
                "text": "SAHP to DOJ: Bad copy!"
              },
              {
                "text": "SAHP to DOJ: Bad copy, we're currently in a pursuit!"
              },
              {
                "text": "SAHP to DOJ: We have a 10-15 at DOC requesting a lawyer, are any available?"
              },
              {
                "text": "SAHP to DOJ: 10-4, much appreciated!"
              }
            ]
          },
          {
            "title": "SAHP to LSPD",
            "commands": [
              {
                "text": "SAHP to LSPD: How copy?"
              },
              {
                "text": "SAHP to LSPD: Good copy, send traffic!"
              },
              {
                "text": "SAHP to LSPD: Bad copy!"
              },
              {
                "text": "SAHP to LSPD: Bad copy, we're currently in a pursuit!"
              },
              {
                "text": "SAHP to LSPD: Requesting backup for a high-speed chase in your jurisdiction."
              },
              {
                "text": "SAHP to LSPD: 10-4, much appreciated!"
              }
            ]
          },
          {
            "title": "SAHP to FIB",
            "commands": [
              {
                "text": "SAHP to FIB: How copy?"
              },
              {
                "text": "SAHP to FIB: Good copy, send traffic!"
              },
              {
                "text": "SAHP to FIB: Bad copy!"
              },
              {
                "text": "SAHP to FIB: Bad copy, we're currently in a pursuit!"
              },
              {
                "text": "SAHP to FIB: Requesting assistance for a multi-vehicle collision investigation."
              },
              {
                "text": "SAHP to FIB: 10-4, much appreciated!"
              }
            ]
          },
          {
            "title": "SAHP to EMS",
            "commands": [
              {
                "text": "SAHP to EMS: How copy?"
              },
              {
                "text": "SAHP to EMS: Good copy, send traffic!"
              },
              {
                "text": "SAHP to EMS: Bad copy!"
              },
              {
                "text": "SAHP to EMS: Bad copy, we're currently managing a crash site!"
              },
              {
                "text": "SAHP to EMS: Requesting immediate medical assistance at highway collision."
              },
              {
                "text": "SAHP to EMS: 10-4, much appreciated!"
              }
            ]
          },
          {
            "title": "SAHP to GOV",
            "commands": [
              {
                "text": "SAHP to GOV: How copy?"
              },
              {
                "text": "SAHP to GOV: Good copy, send traffic!"
              },
              {
                "text": "SAHP to GOV: Bad copy!"
              },
              {
                "text": "SAHP to GOV: Bad copy, we're currently in a pursuit!"
              },
              {
                "text": "SAHP to GOV: Troopers enroute!"
              },
              {
                "text": "SAHP to GOV: Can we have a quick meeting at capitol?"
              },
              {
                "text": "SAHP to GOV: Requesting permission to land on your lawn."
              },
              {
                "text": "SAHP to GOV: We have one of your units in custody, could you 10-17 to DOC?"
              },
              {
                "text": "SAHP to GOV: 10-4, much appreciated!"
              }
            ]
          },
          {
            "title": "SAHP to GLOBAL",
            "commands": [
              {
                "text": "SAHP to GLOBAL: What's the situation?"
              },
              {
                "text": "SAHP to ALL: Global is for regrouping after the latest store robbery. Please dispatch max units"
              },
              {
                "text": "SAHP to ALL: Global is for a high-speed pursuit, send all available units!"
              },
              {
                "text": "SAHP to ALL: Major collision on the highway, send all available units!"
              },
              {
                "text": "SAHP to ALL: Global is for a sobriety checkpoint, everyone is invited!"
              },
              {
                "text": "SAHP to ALL: Be on standby for a possible roadblock situation!"
              },
              {
                "text": "SAHP to ALL: The Global is 10-99."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "ng",
    "name": "National Guard",
    "shortName": "NG",
    "color": "#22c55e",
    "glowColor": "rgba(34,197,94,0.4)",
    "sections": [
      {
        "title": "Bodycam Commands (Part 1)",
        "groups": [
          {
            "title": "Attaching Bodycam",
            "commands": [
              {
                "text": "/me Takes out bodycam, attaches it to chest, checks its ballistic, water proof"
              },
              {
                "text": "/me makes sure it is recording and checks for the red light"
              },
              {
                "text": "/do It is recording, is ballistic and water proof"
              },
              {
                "text": "/me connects PDA to the nearest cell tower"
              }
            ]
          },
          {
            "title": "Refreshing Bodycam",
            "commands": [
              {
                "text": "/me refreshing bodycam"
              },
              {
                "text": "/do It is recording"
              }
            ]
          },
          {
            "title": "Saving Bodycam",
            "commands": [
              {
                "text": "/me saves bodycam content to a SD Card, uploads it to the NG Cloud and continues recording"
              },
              {
                "text": "/do It is recording"
              }
            ]
          },
          {
            "title": "Breaking the Trunk",
            "commands": [
              {
                "text": "/me carefully inspects the trunk and uses a crowbar to attempt opening it"
              },
              {
                "text": "/me applies pressure with the crowbar to force the trunk open"
              }
            ]
          },
          {
            "title": "Handing Footage to the Lawyer",
            "commands": [
              {
                "text": "/me saves bodycam contents onto an SD card and uploads contents to NG servers"
              },
              {
                "text": "/me Takes SD card out of the bodycam and hands it to the lawyer"
              }
            ]
          },
          {
            "title": "Finishing Your Shift",
            "commands": [
              {
                "text": "/me saves bodycam contents onto an SD card and uploads contents to NG servers"
              },
              {
                "text": "/me puts the badge in the locker"
              }
            ]
          }
        ]
      },
      {
        "title": "Bodycam Commands (Part 2)",
        "groups": [
          {
            "title": "Attaching Bodycam",
            "commands": [
              {
                "text": "/me Takes out bodycam, attaches it to chest, checks its ballistic, water proof"
              },
              {
                "text": "/me makes sure it is recording and checks for the red light"
              },
              {
                "text": "/do It is recording, is ballistic and water proof"
              },
              {
                "text": "/me connects PDA to the nearest cell tower"
              }
            ]
          },
          {
            "title": "Refreshing Bodycam",
            "commands": [
              {
                "text": "/me refreshing bodycam"
              },
              {
                "text": "/do It is recording"
              }
            ]
          },
          {
            "title": "Saving Bodycam",
            "commands": [
              {
                "text": "/me saves bodycam contents onto an SD card, then uploads it to NG cloud servers using PDA."
              },
              {
                "text": "/do Bodycam refreshes and continues recording."
              }
            ]
          },
          {
            "title": "Breaking the Trunk",
            "commands": [
              {
                "text": "/me carefully inspects the trunk and uses a crowbar to attempt opening it"
              },
              {
                "text": "/me applies pressure with the crowbar to force the trunk open"
              }
            ]
          },
          {
            "title": "Handing Footage to the Lawyer",
            "commands": [
              {
                "text": "/me saves bodycam contents onto an SD card and uploads contents to NG servers"
              },
              {
                "text": "/me Takes SD card out of the bodycam and hands it to the lawyer"
              }
            ]
          },
          {
            "title": "Finishing Your Shift",
            "commands": [
              {
                "text": "/me saves bodycam contents onto an SD card and uploads contents to NG servers"
              },
              {
                "text": "/me puts the badge in the locker"
              }
            ]
          }
        ]
      },
      {
        "title": "Department Codes & Messages",
        "groups": [
          {
            "title": "NG to DOJ",
            "commands": [
              {
                "text": "NG to DOJ: How copy?"
              },
              {
                "text": "NG to DOJ: Good copy, send traffic!"
              },
              {
                "text": "NG to DOJ: Bad copy!"
              },
              {
                "text": "NG to DOJ: Bad copy, we're currently in a situation!"
              },
              {
                "text": "NG to DOJ: We have a 10-15 at DOC requesting a lawyer. Are there any available?"
              },
              {
                "text": "NG to DOJ: 10-4, much appreciated!"
              }
            ]
          },
          {
            "title": "NG to GOV",
            "commands": [
              {
                "text": "NG to GOV: How copy?"
              },
              {
                "text": "NG to GOV: Good copy, send traffic!"
              },
              {
                "text": "NG to GOV: Bad copy!"
              },
              {
                "text": "NG to GOV: Bad copy, we're currently in a situation!"
              },
              {
                "text": "NG to GOV: Agents enroute!"
              },
              {
                "text": "NG to GOV: Can we have a quick meeting at capitol?"
              },
              {
                "text": "NG to GOV: Requesting permission to land on your lawn."
              },
              {
                "text": "NG to GOV: We have one of your units in custody, could you 10-17 to DOC?"
              },
              {
                "text": "NG to GOV: 10-4, much appreciated!"
              }
            ]
          },
          {
            "title": "NG to FIB",
            "commands": [
              {
                "text": "NG to FIB: How copy?"
              },
              {
                "text": "NG to FIB: Good copy, send traffic!"
              },
              {
                "text": "NG to FIB: Bad copy!"
              },
              {
                "text": "NG to FIB: Bad copy, we're currently in a situation!"
              },
              {
                "text": "NG to FIB: Can we have a quick meeting at your HQ?"
              },
              {
                "text": "NG to FIB: Requesting permission to land at your helipad."
              },
              {
                "text": "NG to FIB: We are entering your jurisdiction in chase of a car hijacker, help would be appreciated."
              },
              {
                "text": "NG to FIB: We have one of your units in custody, could you 10-17 to DOC?"
              },
              {
                "text": "NG to FIB: We're currently enroute!"
              },
              {
                "text": "NG to FIB: 10-4, much appreciated!"
              },
              {
                "text": "NG to FIB: Permission Granted!"
              },
              {
                "text": "NG To FIB: We have a 10-15 at Our Main Barricks Please send a unit to process him."
              }
            ]
          },
          {
            "title": "NG to LSPD",
            "commands": [
              {
                "text": "NG to LSPD: How copy?"
              },
              {
                "text": "NG to LSPD: Good copy, send traffic!"
              },
              {
                "text": "NG to LSPD: Bad copy!"
              },
              {
                "text": "NG to LSPD: Bad copy, we're currently in a situation!"
              },
              {
                "text": "NG to LSPD: Can we have a quick meeting at your main barracks?"
              },
              {
                "text": "NG to LSPD: Requesting permission to land at your main barracks."
              },
              {
                "text": "NG to LSPD: We have one of your soldiers in custody, could you 10-17 to DOC?"
              },
              {
                "text": "NG to LSPD: We're currently enroute!"
              },
              {
                "text": "NG to LSPD: 10-4, much appreciated!"
              },
              {
                "text": "NG to LSPD: Permission Granted!"
              },
              {
                "text": "NG to LSPD: We have a 10-15 at Our Main Barricks Please send a unit to process him."
              }
            ]
          },
          {
            "title": "NG to SAHP",
            "commands": [
              {
                "text": "NG to SAHP: Good copy, send traffic!"
              },
              {
                "text": "NG to SAHP: Bad copy!"
              },
              {
                "text": "NG to SAHP: Bad copy, we're currently in a situation!"
              },
              {
                "text": "NG to SAHP: Can we have a quick meeting at your hall?"
              },
              {
                "text": "NG to SAHP: Requesting permission to land at your helipad."
              },
              {
                "text": "NG to SAHP: We have one of your agents in custody, could you 10-17 to DOC?"
              },
              {
                "text": "NG to SAHP: We're currently enroute!"
              },
              {
                "text": "NG to SAHP: Troopers enroute!"
              },
              {
                "text": "NG to SAHP: 10-4, much appreciated!"
              },
              {
                "text": "NG to SAHP: Permission Granted!"
              },
              {
                "text": "NG to SAHP: We have a 10-15 at Our Main Barricks Please send a unit to process him."
              }
            ]
          },
          {
            "title": "NG to EMS",
            "commands": [
              {
                "text": "NG to EMS: How copy?"
              },
              {
                "text": "NG to EMS: Good copy, send traffic!"
              },
              {
                "text": "NG to EMS: Bad copy!"
              },
              {
                "text": "NG to EMS: Bad copy, we're currently in a situation!"
              },
              {
                "text": "NG to EMS: Ghetto is off limits for the next 25 minutes, please inform all your units."
              },
              {
                "text": "NG to EMS: Can we have a quick meeting at Pillbox Hospital?"
              },
              {
                "text": "NG to EMS: Requesting permission to land at your helipad."
              },
              {
                "text": "NG to EMS: We have one of your employees in custody, could you 10-17 to DOC?"
              },
              {
                "text": "NG to EMS: We're currently enroute!"
              },
              {
                "text": "NG to EMS: Clean!"
              },
              {
                "text": "NG to EMS: 10-4, much appreciated!"
              },
              {
                "text": "NG to EMS: Permission Granted!"
              }
            ]
          },
          {
            "title": "NG to GLOBAL",
            "commands": [
              {
                "text": "NG to GLOBAL: What's the situation?"
              },
              {
                "text": "NG to ALL: Global is for heavy 10-10s, send all available units!"
              },
              {
                "text": "NG to ALL: Soldiers is getting robbed at global, send all available units!"
              },
              {
                "text": "NG to ALL: Global is for a hood watch, send all available units!"
              },
              {
                "text": "NG to ALL: Global is for a checkpoint, everyone is invited!"
              },
              {
                "text": "NG to ALL: Be on standby for a possible hostage situation!"
              },
              {
                "text": "NG to ALL: The Global is 10-99."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "badcop",
    "name": "Corrupt individuals",
    "shortName": "Bad Cop",
    "color": "#ec7728",
    "glowColor": "rgba(196, 110, 39, 0.4)",
    "sections": [
      {
        "title": "Chat Commands (Try command can only be used twice per situation)",
        "groups": [
          {
            "title": "Breaking bodycam of the target",
            "commands": [
              {
                "text": "/try Finds the bodycam of the person in front and breaks it"
              },
              {
                "text": "/do Make sure that Bodycam is Broken"
              }
            ]
          },
          {
            "title": "Inject Truth Serum to the target",
            "commands": [
              {
                "text": "/try Injects the Truth Serum into the person in front"
              }
            ]
          },
          {
            "title": "Put tape on target's mouth (Silencing Target)",
            "commands": [
              {
                "text": "/try Tapes the mouth of the person in front"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "gpro",
    "name": "GrandPro camera and PDA Commands",
    "shortName": "GrandPro",
    "color": "#05b379",
    "glowColor": "#096d4c",
    "sections": [
      {
        "title": "Bodycam & PDA Commands",
        "groups": [
          {
            "title": "Save Bodycam (To SD Card)",
            "commands": [
              {
                "text": "/me saves the bodycam into an SD card"
              }
            ]
          },
          {
            "title": "Connecting PDA",
            "commands": [
              {
                "text": "/me connects the PDA to nearby cell tower"
              }
            ]
          },
          {
            "title": "Save bodycam (To Cloud Servers, Make sure to connect PDA to nearest cell towers)",
            "commands": [
              {
                "text": "/me saves the bodycam to SAHP/LSPD/FIB/NG/GOV cloud servers using PDA"
              }
            ]
          },
          {
            "title": "Connect grand pro to Cloud Servers",
            "commands": [
              {
                "text": "/me connects grand pro to SAHP/LSPD/FIB/NG/GOV cloud servers using PDA"
              }
            ]
          },
          {
            "title": "Saving grand pro footage to SD Card and Hands over",
            "commands": [
              {
                "text": "/me Saves the bodycam to an SD card, takes it out and hands it over to opposite person"
              }
            ]
          },
          {
            "title": "Saving grand pro footage to SD Card.",
            "commands": [
              {
                "text": "/me Saves the bodycam to an SD card and takes it out."
              }
            ]
          }
        ]
      }
    ]
  }
];
