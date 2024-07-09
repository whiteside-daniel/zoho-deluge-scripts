# Run CRM Functions via crontab
linux and MacOS have a feature called crontab which is a job scheduler. You can use it to achieve faster scheduling than CRM can accomplish with the out-of-box features.

In this example, you'll see  how to trigger a CRM function automatically every 5 minutes.

This should work out of the box on any Linux or MacOS machine. I originally deployed this on a DigitalOcean Ubuntu virtual machine. The only setup was checking that cron was active, but I don't even think that was necessary. Of course if you're using a work computer or operating behind a firewall, you may need to make additional configurations.

## Step 1 - Make a Custom Deluge Function callable via Rest API
Write your custom function in Zoho CRM. Then... go to Setup > Functions and find the custom function you want to schedule. Select 'Rest API' and turn on the slider/selector for API Key functionality. Copy the URL that's given to your clipboard.

## Step 2 - Paste URL into the bash script
Open the trigger_deluge_function.sh bash script and paste in the unique URL copied from step one into the variable for CF_URL (in line 2, trigger_deluge_function.sh). Save this file anywhere on the same machine that you want to run the schedule. Make sure you remember the exact path where you saved the file. 

## Step 3 - Edit your crontab file
Open a Linux or Mac Terminal Window and type `crontab -e`. This will open the cron file which schedules jobs automatically. You will need to edit this file (using vim or nano, depending on your operating system's default terminal text editor). 

For vim, type `i` to edit/insert, `Esc` when you're finished editing, and `:wq` to save and exit the text editor. For nano, click `Control + X` to save/exit.

In the crontab file, you need to add the following line to schedule the job to run every five minutes. You can change the value to any integer that suits your needs. See cron file syntax for even more potential here.

`*/5 * * * * /path/to/trigger_deluge_function.sh`

## That's it!
As soon as you exit/save the cron file, your os should recognize the new job and begin immediately. It will continue until you re-edit the cron file and remove that line. Pretty cool!