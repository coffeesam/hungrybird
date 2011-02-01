require 'date'

yesterday           = Date.today - 1
yesterday_timestamp = "#{yesterday.to_time.to_i}000"

today               = Date.today
today_timestamp     = "#{today.to_time.to_i}000"

backup_dir = "/mnt/dump/"
backup     = "#{backup_dir}#{today.to_s}"
backup_tgz = "#{today.to_s}.tgz"

# Tables
cmd = "sudo mongodump --db Hungrybird -c hits -o #{backup}  -q '{ timestamp : { $gte : new Date(#{yesterday_timestamp}), $lt: new Date(#{today_timestamp}) } }'"
puts cmd
system(cmd)
puts "Done with Hits"

# Indexes
cmd = "sudo mongodump --db Hungrybird -c system.indexes -o #{backup}"
puts cmd
system(cmd)
puts "Done with Indexes"

# Zip
cmd = "cd #{backup_dir}; sudo tar -czvf #{backup_tgz} #{today.to_s}/"
puts cmd
system(cmd)
puts "Done with Zipping"

# Upload
cmd = "cd #{backup_dir}; s3cmd put #{backup_tgz} s3://#{ENV['S3_BUCKET']}/#{backup_tgz}"
puts cmd
system(cmd)
puts "Done with Upload"

# Delete
cmd = "cd #{backup_dir}; sudo rm -rf #{today.to_s}; sudo rm -rf #{backup_tgz}"
puts cmd
system(cmd)
puts "Done with Delete"