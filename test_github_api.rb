require 'pry'
require 'typhoeus'
require 'json'

# require 'github_api'

# g = Github.new
# g.gists.gist_comments '1718696'

GITHUB_API_URL  = 'https://api.github.com'
GITHUB_MIMETYPE = 'application/json'


id = '1718696'

@url = "#{GITHUB_API_URL}/gists/#{id}"

response = Typhoeus::Request.get(@url,
                                 :headers => { :Accept => GITHUB_MIMETYPE })

g1 = JSON::parse(response.body)

username = 'richardkmichael'

@url = "#{GITHUB_API_URL}/users/#{username}/gists"

response = Typhoeus::Request.get(@url,
                                 :headers => { :Accept => GITHUB_MIMETYPE })

g2 = JSON::parse(response.body)

binding.pry
