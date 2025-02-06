# Site24x7 APM Insight for Node.js

Monitor and optimize your Node.js application performance with a Site24x7 APM Insight agent. This agent provides you information on your application's response time, throughput, database operations, and errors. Track these metrics over time to identify where to optimize them for enhanced performance.

Before you can use an APM Insight agent to monitor metrics, you need a [Site24x7 account.][1]

## Table of contents:
* Installing an APM Insight agent
* Performance Metrics
 
## Installing an APM Insight agent in Node.js
* Navigate to your Node.js application directory in terminal.
* Use the following command to install an APM Insight Node.js agent. This will create apminsight directory under node_modules.
`npm i apminsight --save`
* Include the following code in the first line of your Node.js application start file.
```
    require('apminsight')({
    licenseKey : '<device-key>',
    appName : '<application-name>',
    port : <application-port>})
```
* If you use proxy connections, enter this code instead.
```
    require('apminsight')({
    licenseKey : '<device-key>',
    appName : '<application-name>',
    port : <application-port>,
    proxyServerHost : '<proxy-server>',
    proxyServerPort : <proxy-port>,
    proxyAuthUser : '<proxy-user-name>',
    proxyAuthPassword : '<proxy-password>'
})
```
* Ensure that you have configured all necessary parameters.
* **Note:** You can find your license key by logging into Site24x7, then going to Admin > Developer > Device Key.
* Restart your application.

## Performance Metrics
* **Apdex score:** The Apdex score serves as a direct translation of your customers' satisfaction. The score ranges from 0 to 1, with a value closer to 0 denoting frustrated users and closer to 1 denoting the maximum level of satisfaction.

* **Average Response time:** The Average response time gives you an overview of the time taken by your app to respond to a request.

* **Components overview:** [View external components connected with your application][2], as well as the number of ongoing and failed requests. The response time taken by each component is also tracked and shown here.

* **Web transactions:** Transactions for a chosen time period are shown here along with their recent traces, including error transactions, error components, response time, throughput and HTTP components.

* **Database operations:** Database operations shows all database operations along with their count and throughput time.

* **Trace details:** Shows detailed timeline of method calls, database queries and other external compomonents. 

* **RUM integration:** [Integrate your Node.js application with Site24x7 real user monitoring][3] (RUM) to get real-time data, including browser details, JS errors, Ajax calls, and region-specific performance of your application.

[1]: https://www.site24x7.com/application-performance-monitoring.html
[2]: https://www.site24x7.com/application-dependency-maps.html
[3]: https://www.site24x7.com/help/apm/rum.html