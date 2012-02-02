require 'json'
require 'typhoeus'

class Gist

  GITHUB_API_URL  = 'https://api.github.com'
  GITHUB_MIMETYPE = 'application/json'

  attr_reader :json, :url, :files, :content


  def initialize( id = '' )
    if id =~ /^\d+$/
      @url = "#{GITHUB_API_URL}/gists/#{id}"

      response = Typhoeus::Request.get(@url,
                                       :headers => { :Accept => GITHUB_MIMETYPE })

      @json = JSON::parse(response.body)
    else
      @url = ''
      @json = {}
    end
  end

  def json
    @json.to_s
  end

  # def files
  #   @json['files'] || {}
  # end

  def content
    if files = @json['files']
      files[files.keys.first]['content']
    else
      ''
    end
  end
end
