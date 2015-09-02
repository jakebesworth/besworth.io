------------------------------------------------------------------------------------------------------------------------------

 ____                               ____       _    _  __                           ___        __                      _      
/ ___| _   _ _ __   __ _ _ __  _ __|___ \     / \  | |/ _|_ __ ___  ___  ___ ___   |_ _|_ __  / _| ___  _ __ _ __ ___ (_)_  __
\___ \| | | | '_ \ / _` | '_ \| '_ \ __) |   / _ \ | | |_| '__/ _ \/ __|/ __/ _ \   | || '_ \| |_ / _ \| '__| '_ ` _ \| \ \/ /
 ___) | |_| | | | | (_| | |_) | |_) / __/   / ___ \| |  _| | |  __/\__ \ (_| (_) |  | || | | |  _| (_) | |  | | | | | | |>  < 
|____/ \__, |_| |_|\__,_| .__/| .__/_____| /_/   \_\_|_| |_|  \___||___/\___\___/  |___|_| |_|_|  \___/|_|  |_| |_| |_|_/_/\_\
       |___/            |_|   |_|                                                                                             

------------------------------------------------------------------------------------------------------------------------------

--- AUTHOR

------------------------------------------------------------------------------------------------------------------------------


    Jake Besworth  -   jakebesworth@gmail.com - Alfresco Informix Integration

    Richard Howell -   richard@synapp2.org    - Synapp2


------------------------------------------------------------------------------------------------------------------------------

--- DATE

------------------------------------------------------------------------------------------------------------------------------

    2015, May - August

------------------------------------------------------------------------------------------------------------------------------

--- CHANGES

------------------------------------------------------------------------------------------------------------------------------


    Report-time Sorting:

        - Applications have 3 levels of report-time sorting
        - Report time sorting allows users to add order by values to a report select query
        - Any selected values preceding a blank (default) sort option are ignored
        - Example report-time sorting effect on a query: "Employee_Name ASC, Employee_Certificate DESC, Employee_Parking ASC"

    Alfresco Integration and PHP API Library:
    
        - Alfresco.php library included in _shared_
        - Compatible with Alfresco Community > 4.0
        - Used by Synapp2 to HTTP POST via php5-curl to Alfresco API
            - Possible actions include login, upload file, get file properties, logout... 

    Synapp2 Options/Config Alfresco Configuration:

        - Synapp2/Options sub-menu called "config" which displays the content of a project's .config.php file
        - .config.php files include Alfresco information such as:
            - username, password, host, site (root directory), directory (sub-directory where files are to be located)

    Synapp2 File Upload Capabilities:

        - Application input forms include the html input type "file"
        - A file input is designated by the keyword "document" in lowercase anywhere in the needed column name
        - The column definition containing a varchar of at least 155 is required based on hostname length (see below), 255 is recommended for any length
          NOTE: There are file restrictions in place, found in action.php (function isFile)
                Check php.ini to change max upload size etc...
        - Multiple document columns are allowed in any one table (1-4 tested and working, more theoretically possible)

    Select Form Alfresco Document Integration:

        - Select Forms display Alfresco generated thumbnails and links to the documents if the record contains an Alfresco link
        - Alfresco links are generated and stored in the database as such:
            - http://alfresco.example.ca:8080/alfresco/service/api/node/workspace/SpacesStore/a22c8d51-d260-4ff4-aea1-59616aae3690/content
        - Select form buttons have the ability to communicate to an Alfresco instance through either the delete or edit button
        - The delete button removes (for purge, see alfresco.php) the document from Alfresco and the record from the database
        - Edit has 5 possible cases and allows the manipulation of the document and/or the record:

            1)  The record contains a document, the user requests a file upload
                - The record maintains the same node link (unchanged), the Alfresco document and version is updated

            2)  The record does not contain a document, the user requests a file upload
                - The file is uploaded to Alfresco and the node link is added to the record

            3)  The record contains a document, and no user upload is present
                - The record document column remains unchanged
    
            4)  The record does not contain a document, and no user upload is present
                - Normal edit, nothing Alfresco-related takes place

            5) The user Ctrl+clicks the document-link (see Edit Form: section)
               - The document link is removed from the record, the document is deleted from Alfresco, record remains in the database

    Edit Form:

        - Input file types are replaced by a link (value = file-name) whenever an Alfresco document is requested from the record
        - The link when clicked unhides the file upload button, allowing users to re-upload a document
        - The link when Ctrl+Clicked (Firefox, Chrome, Chromium compatible) prompts for a file delete (from Alfresco and the record)
        - Clickable document thumbnails are displayed as well under the file name link

    Roles and permissions:

        - Roles and permissions allows non-Synapp2 users to login via an imap server, and can be given certain permissions pertaining to different applications
        - Under Synapp2/Options there are /users/ /roles/ /permissions/ sub-menus
        - These sub-menus map to tables in the synapp2 database permissions, roles, user_role
        - user_role is table that connects Synapp2 user logins to an imap-mailing list - configuration is hard-coded in access.php
            - User login using their email credentials and are logged into Synapp2 based on username
        - roles is a reference table that's values are used as unique keywords to connect the user_role, permissions tables
        - Permissions, map a role     appid    permission
                             ----     -----    ----------
            Example:         admin -> msds  -> CRUD
                             admin -> alph  -> CRD

                             user     role
                             ----     ----
                             besw     admin

            User besw now has the admin role and full access to the msds app, but only create, read, delete and not update access to alph

            NOTE: Roles are taken from the roles table, appid is the application name, and permission is one, two, three or all letters of CRUD
            NOTE: Users should be given R as a default

        - Roles and permissions happen in a specific order:
    
            1) User is authenticated, their login information is validated against imap

            2) User is authorized, their login credentials and (R)ead access is checked with the appid they are attempting to access

            3) A User db query request is validated only if a user with X permission can request Y query:
                (C)reate -> INSERT, (R)ead -> SELECT, (U)pdate -> UPDATE, (D)elete -> DELETE

            4) Even if a user has R permission, they cannot click buttons mapping the CRUD permission they lack, e.g. add, delete, edit

    READ-ONLY enabled applications:

        - To allow an App read-only abilities (user does not need to login to have Read permissions), create a user called "READONLY"
        - Map READONLY's role to whatever apps you want, permissions are irrelevant, READONLY can only have 'R'
        - READONLY is forbidden from having synapp2 as an app
        - The user is logged in by default as READONLY, and to login to a real account, merely click the "please login" button at the bottom, or logout at the top
        - The welcome and login page won't log the user in as READONLY

    Report PDF link-generation:

        - Reports show documents as links to the document + the file name 
          NOTE: no ticket or thumbnail included because of expiration

    Informix DS Database support:

        - Informix DBMS software added along with MySQL and Oracle
        - Informix class added to dbx.php
        - Informix databases can be mapped through the Engines options in pagegen (IFX) (See Engines Synapp2 Menu Option: section)

    Engines Synapp2 Menu Option

        - Synapp2 requires two databases, one being the default synapp2 database (login, permissions, roles, applications, engines, keymap) and the app specific database
            - Default engine values are stored in _config_/access.inc.php as opposed to appid/_access.inc.php
        - Engines sub-menu config hosts the default configuration, MySQL is currently required, however a default informix based config is mostly working (see Keymap: section)
        - Applications sub-menu displays the Synapp2/applications table, allowing the developer to add many databases of being Informix or MySQL
        - Engines/Applications Copy down button added - copies a given information into an add input form
        - Engine options are as:
            - engine_name a unique field to identify different records
            - username and password are database credentials (MySQL or Informix login)
            - host being localhost, or remote
            - Database port e.g. MySQL default (3306), Informix default (1705)
            - Server is an Informix only column, leave blank for MySQL
            - Database is the actual database you wish to have (allowing many apps to share a single database)
            - Engine Type is of either IFX, MYSQL, or ORI
        
                Example:

                     Engine Name     Username    Password    Host                    Port    Server     Database    Engine Type
                     -----------     --------    --------    ----                    ----    ------     --------    -----------
                     mysql_msds      beswj       beswj       appserver.example.ca    3306               msds        MYSQL 
                     ifx_msds        jbesw       jbesw       dbbserver.example.ca    1706    my_serv    eagle       IFX:

        - Pagegen menu-bar option (Database DBMS) allows choice of which database "engine_name" to use for which app
            - Selecting an option clears the appid field, choose engine_name, type in new app
            - default value will use the application's default config located in access.inc.php value (generated on click of pagegen button)
        - action.php functions: processEngine and processConfig have input restrictions on characters and length

    Keymap

        - _keymap_ table is local to default database and works off of "engine_name" (unique)
        - _keymap_ contains primary key (pk) definitions
            - Select a pk radio button, and submit any table to define a new primary key
            - Any auto_increment (MySQL) or serial (Informix) field columns will default as primary key or first column
        - _keymap_ contains validation data (normally via Synapp2 - MySQL comments
            - Type in comment information into the text box and click accompanying radio button and submit any table
        - _keymap_ contains a values field to allow Informix fields the same functionality as a MySQL enum field
            - Same as validation, but to create an Informix enum field, type the values as such: 'val1','val2','val3' ...
        - Primary key, validation, values update on submit, but won't display the same as FK definitions, a page refresh to display

    Informix Date

        - dbx.php line,pos 408,62 just rearrange the 0,1,2 values of reverse as noted in the comment


------------------------------------------------------------------------------------------------------------------------------
    
--- NOTES

------------------------------------------------------------------------------------------------------------------------------


    Alfresco Tickets:

        - Tickets from any one Alfresco user are shared among any Synapp2 user on a per application basis via the .ticket.php file
        - New tickets are only generated when the currently shared ticket expires or one is not loaded in .ticket.php
    
    Oracle Incompatibility:

        - Oracle database is no longer compatible with Synapp2 Alfresco Informix (and MySQL) 


------------------------------------------------------------------------------------------------------------------------------

--- SPECIAL FILES

------------------------------------------------------------------------------------------------------------------------------


    error.log:

        - File is generated due to Alfresco API HTTP errors or other small integration related errors (database error.log removed for deployment)


------------------------------------------------------------------------------------------------------------------------------

--- TODO

------------------------------------------------------------------------------------------------------------------------------


    Currently to choose a keymap primary key, validation, or value you need more than 1 table - allow single table databases to choose primary keys
        - Validation and Value fields only apply to Informix databases (mimicking MySQL enum and comment)
        
        
------------------------------------------------------------------------------------------------------------------------------