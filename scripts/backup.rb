require 'date'

yesterday           = Date.today - 1
yesterday_timestamp = "#{yesterday.to_time.to_i}000"

today               = Date.today
today_timestamp     = "#{today.to_time.to_i}000"

output_dir = "/mnt/dump/#{today.to_s}"

# Tables
cmd = "sudo mongodump --db Hungrybird -c hits -o #{output_dir}  -q '{ timestamp : { $gte : new Date(#{yesterday_timestamp}), $lt: new Date(#{today_timestamp}) } }'"
puts cmd
system(cmd)
puts "Done with Hits"

# Indexes
cmd = "sudo mongodump --db Hungrybird -c system.indexes -o #{output_dir}"
puts cmd
system(cmd)
puts "Done with Indexes"

# Zip
cmd = "cd /mnt/dump/; sudo tar -czvf #{today.to_s}.tgz #{today.to_s}/"
puts cmd
system(cmd)
puts "Done with Zipping"
