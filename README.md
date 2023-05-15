# trip-dashboard

enter the desination of a trip and the dashboard will display the nearest traffic road cam and the weather of the nearest town, saving the user time of searching that information separately

this app is containerized using docker and deployed using AWS Elastic Beansprout, with the frontend hosted in an AWS S3 bucket

future features:
- show weather data from the NWS API
- show sunrise/sunset times
- show moonrise/moonset times
  - tell the user what time window they'll have to view the sky after sunset when there's no moon in the sky
- show milky way information
- let user choose a location on a map when submitting the new trip form (as an alternative to entering an exact latitude and longitude)