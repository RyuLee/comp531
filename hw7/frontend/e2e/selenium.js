var webdriver = require('selenium-webdriver')

var url = 'http://localhost:8080/webpack-dev-server/'

var driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build()

exports.driver = driver``
exports.By = webdriver.By
exports.findId = id => driver.findElement(webdriver.By.id(id))
exports.findCSS = css => driver.findElement(webdriver.By.css(css))
exports.go = _ => driver.navigate().to(url)
exports.sleep = millis => driver.sleep(millis)
exports.maximize = _ =>driver.manage().window().maximize()