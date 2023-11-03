param (
    [string]$destination_folder
)

if (!(Test-Path -path $destination_folder))
{
    New-Item -ItemType Directory -Force -Path $destination_folder
}
Copy-Item "manifest.json" -Destination $destination_folder
Copy-Item "main.js" -Destination $destination_folder
Copy-Item "styles.css" -Destination $destination_folder
