var appHost = process.env.APP_HOST || process.env.VCAP_APPLICATION && JSON.parse(process.env.VCAP_APPLICATION).application_uris[0] || "https://xyz";
var xmlCert = process.env.XML_CERT || "ABCD"; 

module.exports = {
    "dev" : {
        passport: {
            strategy : 'saml',
            saml : {
                issuer:                 "https://" + appHost + "/",  //  "https://your-app.w3ibm.mybluemix.net/"
                callbackUrl:            "https://" + appHost + "/login/callback/postResponse",

                // Your SAML private signing key. Mellon script generates PKCS#8 key, make sure your key's header matches the ----BEGIN * PRIVATE KEY----- header here
                privateCert:            xmlCert ? "-----BEGIN PRIVATE KEY-----\n" + 
                                        xmlCert.match(/.{1,64}/g).join('\n') + 
                                        "\n-----END PRIVATE KEY-----\n" : undefined,
                signatureAlgorithm:     'sha256',
                
                // List groups that permit access to the application. Comment out to allow all authenticated users
                // blueGroupCheck:         ["w3id-saml-adopters-techcontacts", "w3legacy-saml-adopters-techcontacts"],
                // Some SSO templates return blueGroups attribute as JSON
                // attributesAsJson:       {"blueGroups": true},

                passive:                        false,
                identifierFormat:               "urn:oasis:names:tc:SAML:2.0:nameid-format:transient",
                skipRequestCompression:         false,
                disableRequestedAuthnContext:   true,

                // Update IDP attributes according to the service used
                entryPoint:     "ABCD", 
                logoutUrl:      "ABCD",
                // Old w3id Staging certificate
                //cert:           "MIIDdzCCAl+gAwIBAgIENmZ8gDANBgkqhkiG9w0BAQsFADBsMQswCQYDVQQGEwJVUzELMAkGA1UECBMCTlkxDzANBgNVBAcTBkFybW9uazEQMA4GA1UEChMHaWJtLmNvbTEMMAoGA1UECxMDQ0lTMR8wHQYDVQQDExZ3M2lkLmFscGhhLnNzby5pYm0uY29tMB4XDTE1MTEyMDE3NDAyM1oXDTE4MTExOTE3NDAyM1owbDELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAk5ZMQ8wDQYDVQQHEwZBcm1vbmsxEDAOBgNVBAoTB2libS5jb20xDDAKBgNVBAsTA0NJUzEfMB0GA1UEAxMWdzNpZC5hbHBoYS5zc28uaWJtLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAIMdVEidEhUKdfUFwR5+bOk12uJHtiE2D+6LyeMJOdLInWbNFrl3WP9TL5fjeF9oNACQcuQy7Ll2rt+UqUXbU3pVvT7bzoyfeJWAPjzRqFP2f/U40sBbftVHnbC8mRcwD7VyJqjB3IIfV78mYfrJUM6b3hYW2GGU9dzkNpKc1S7dDmbpkOwFqn4PgRVJNnS3eZq7T46hS6gjnfD1MAsDTPszkwMWB4jMQuhvswt3+fgcGBmKlQFVXidDRyg7aA8oYq5Mj07307ulywzt/oyXljQCai/9M1wg3MpuQ+Qb0iJ+W1oiBRpRUATbYuUFC3fPV886LmH7UOd6MxrWrGjuuS8CAwEAAaMhMB8wHQYDVR0OBBYEFAtr3Gj757xspsi5XIZI7E9041j+MA0GCSqGSIb3DQEBCwUAA4IBAQBGM7PALAwVEsqS8egOHMOGuKTSSPZVCdlxi8xpP4f5feoaK0f7gqiD2ujsi7Oy7IuZ4USAh61tjSmdayHDTwrfpih+vaMts5lz4O+Z5Ox/2itYggDOPp3ajohVfGn0EupWnRVy3RotiWQ9WvHeBTCitmEICLnSi4gYmfILeJKBCo5zrM1E2OD2ESdtTLwgQyx9xxL78Zf/yF0l8e4o1ttwuxx/e/IghC1OQcX2mIlH/68NABTYD3jLdNUK65zrbMhRPhWpqXEdOOmKdQjtcZPpihVawDSHGjVhqPaYam7/aAMJ5jJHuy2qZCM8ZgY05KVmlcdO/S4rCgeXLS8uMhpE"
                // New w3id Staging certificate
                cert:           "ABCD"

            },
            sessionSecret: xmlCert
        }
    }
};