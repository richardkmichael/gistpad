require 'rubygems'

require 'minitest/unit'
require 'minitest/autorun'

require_relative 'gist'

class TestGist < MiniTest::Unit::TestCase

  def setup
    gist = '1718696'
    @gist = Gist.new gist
  end

  def test_it_creates_a_gist_object
    empty_gist = Gist.new

    assert_empty empty_gist.url
    assert_empty empty_gist.content
    assert_equal '{}', empty_gist.json
  end

  def test_it_has_a_valid_url
    assert_equal 'https://api.github.com/gists/1718696', @gist.url
  end

  def test_it_retreives_a_gist
    refute_equal @gist.json['message'], 'Not Found'
  end

  def test_it_has_content
    refute_empty @gist.content
  end

  # def test_it_has_only_one_file
  #   assert_equal 1, @gist.files.count
  # end

  # def test_it_has_the_correct_file
  #   assert @gist.files['test-openssl.rb']
  # end

end
