https://webapi3.progressplay.net/docs/api/v1.0/index#!/Players/

to get addressses: api/registration/getAddress?bpc=1

Login mock data:
Email: "mahyar.xhu@gmail.com"
Password: "84594f7f73006a95762f6b4831135ab8"
GameToken: ""
LanguageID: 254
PlatformType: 750
PlayMode: 707
UserAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36|false"
WhiteLabelId: 0



-------------------------------- Registration -----------------------------
POST https://www.betblink.com/api/registration/registrationDataForLogin
Body:
{"Email":"benjamin.ekramiand@gmail.com","Password":"84594f7f73006a95762f6b4831135ab8"}

Step 1:
POST https://www.betblink.com/api/registration/registrationStepFirst
Body:
{
    "Email":"benjamin.ekramiand@gmail.com",
    "Password":"84594f7f73006a95762f6b4831135ab8",
    "CellphoneNumber":"78965421356",
    "UserAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36|false",
    "WhiteLabelId":277,
    "PlatformType":0,
    "CountryId":221,
    "LanguageId":254,
    "CurrencyId":3,
    "RegistrationPlayMode":707,
    "Tracker":"",
    "ClickId":"",
    "Dynamic":"",
    "WelcomeBonusDesc":"100% up to £100 + Free Spins",
    "WelcomeBonusDescSport":"Deposit Min. £10 and Get £20 Free Bet"
}

Step 2:

api/registration/registrationStepThird
Body:
{
    "PlayerId":9737199,
    "Address":"184 Whitlock Drive",
    "City":"London",
    "ZipCode":"SW19 6SW",
    "ProfessionId":0,
    "ProfessionName":"",
    "CurrencyId":3,
    "PromotionCode":"",
    "GenderID":358,
    "UserAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36|false",
    "savedData":{},
    "PlayerCommunicationConsent":[{"Id":64579684,"PlayerId":9737199,"PlayMode":706,"CommunicationChannel":-101,"Enabled":false,"IsDeleted":false},{"Id":64579683,"PlayerId":9737199,"PlayMode":706,"CommunicationChannel":-100,"Enabled":false,"IsDeleted":false},{"Id":64579688,"PlayerId":9737199,"PlayMode":707,"CommunicationChannel":-101,"Enabled":false,"IsDeleted":false},{"Id":64579687,"PlayerId":9737199,"PlayMode":707,"CommunicationChannel":-100,"Enabled":false,"IsDeleted":false},{"Id":64579686,"PlayerId":9737199,"PlayMode":911,"CommunicationChannel":-101,"Enabled":false,"IsDeleted":false},{"Id":64579685,"PlayerId":9737199,"PlayMode":911,"CommunicationChannel":-100,"Enabled":false,"IsDeleted":false}],
    "Area":"Wandsworth",
    "BuildingNumber":"184",
    "Street":"Whitlock Drive",
    "Company":"",
    "FirstName":"Hossein",
    "LastName":"Ek",
    "Gender":"male",
    "Birthday":"1991-06-26",
    "ReceivePartner":false,
    "ReceiveEmail":false,
    "ReceiveSMS":false,
    "ReceivePhone":false,
    "ReceivePost":false,
    "ShowConsent":false,
    "CommunicationConsents":[{"Id":64579684,"PlayerId":9737199,"PlayMode":706,"CommunicationChannel":-101,"Enabled":false,"IsDeleted":false},{"Id":64579683,"PlayerId":9737199,"PlayMode":706,"CommunicationChannel":-100,"Enabled":false,"IsDeleted":false},{"Id":64579688,"PlayerId":9737199,"PlayMode":707,"CommunicationChannel":-101,"Enabled":false,"IsDeleted":false},{"Id":64579687,"PlayerId":9737199,"PlayMode":707,"CommunicationChannel":-100,"Enabled":false,"IsDeleted":false},{"Id":64579686,"PlayerId":9737199,"PlayMode":911,"CommunicationChannel":-101,"Enabled":false,"IsDeleted":false},{"Id":64579685,"PlayerId":9737199,"PlayMode":911,"CommunicationChannel":-100,"Enabled":false,"IsDeleted":false}],
    "HasMarketingConsentGrid":true
}

