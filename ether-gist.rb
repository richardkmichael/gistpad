require 'sinatra'
require 'haml'

require_relative 'gist'

# before
#   github oauth
# end

get '/' do
  'Please enter a gist in the URL'
end

get %r|/(\d+)$| do |id|

  haml :gist, :locals => { :gist => Gist.new(id) }

end

get '/:username' do |username|

  gists = gists_for_username(username)

  haml :username, :locals => { :username => username, :gists => gists }

end

private

def gists_for_username( username )
  response = Typhoeus::Request.get("#{Gist::GITHUB_API_URL}/users/#{username}/gists",
                                   :headers => { :Accept => Gist::GITHUB_MIMETYPE })

  JSON::parse(response.body)
end

__END__

@@ layout
%html
  %head
    %title EtherGist!
  %body
    = yield


@@ gist
-# Create etherpad, embed in iframe?
%pre= gist.content


@@ username
%h1= username

%h3 Your Most Recent Gists
%ul.gists
  - gists.each do |gist|
    %li
      %a{ :href => "https://gist.github.com/#{gist['id']}" }= "gist: #{gist['id']}"
      %span.description= gist['description']
      %small
        created
        %span.date
          %time.js-relative-date{ :datetime => "gist['updated_at']", :title => "date['updated_at']" } "#{gist['updated_at']}"

%h3 Your Recent Starred Gists
%ul.gists
  - gists.each do |gist|
    %li
      %a{:href => "/dbcd90016aba8e6d0f96"} gist: dbcd90...
      %span.description
      %small
        created
        %span.date
          %time.js-relative-date{:datetime => "2012-01-28T16:28:49-08:00", :title => "2012-01-28 16:28:49"} January 28, 2012
