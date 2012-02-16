require 'sinatra'
require 'haml'
require 'pry'

require_relative 'lib/gist'

# Run on passenger's port for tmp/always_restart.txt development convenience.
set :port, 3000

# before
#   github oauth
# end

get '/' do
  'Please enter a gist in the URL'
end

get %r|/(\d+)$| do |id|

  haml :gist, :locals => { :gist => Gist.new(id) }

end

# Only requests with word characters, e.g. avoids public files and favicon.ico.
get %r|/(\w+)$| do |username|

  gists = gists_for_username(username)

  haml :username, :locals => { :username => username, :gists => gists }

end

private

# FIXME: This should be moved to client-side JavaScript.
def gists_for_username( username )
  response = Typhoeus::Request.get("#{Gist::GITHUB_API_URL}/users/#{username}/gists",
                                   :headers => { :Accept => Gist::GITHUB_MIMETYPE })

  # g = JSON::parse(response.body)
  # binding.pry
  # puts "DEBUG1: #{g.class}"
  # puts "DEBUG1: #{g.first.class}"
  # g

  JSON::parse(response.body)
end

__END__

@@ layout
%html
  %head
    %title EtherGist!
    %link{ :href => '/github.css', :type => 'text/css', :rel => 'stylesheet' }
    %script{ :src => '/gistpad.js', :type => 'text/javascript' }

  %body
    #etherpad-link
      Direct link:

    .etherpad
      %iframe#etherpad{:frameborder => "0",
              :scrolling => "no",
              :height => '850',
              :width => '650',
              :src => "/choose-a-gist.png"} Your browser does not support iframes.

    .gists= yield


@@ username
%h1= username

%h3 Your Most Recent Gists
%ul.gists
  - gists.each do |gist|
    %li
      %img.gist-paste{ :src => 'http://gists.github.com/images/gist/gist/paste.png',
                       :onclick => "createGistPad(#{gist['id']})" }
      %a{ :href => "https://gist.github.com/#{gist['id']}" }= "gist: #{gist['id']}"
      %span.description= gist['description']
      %small
        created
        %span.date
          %time.js-relative-date{ :datetime => gist['updated_at'], :title => gist['updated_at'] }= gist['updated_at']
