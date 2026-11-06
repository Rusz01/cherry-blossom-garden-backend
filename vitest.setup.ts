// Integration-test environment. Loads .env, then forces safe settings so tests
// can never touch a real database or send a real email.
import 'dotenv/config'

const testDatabaseURL = process.env.TEST_DATABASE_URL
if (testDatabaseURL) process.env.DATABASE_URL = testDatabaseURL

process.env.PAYLOAD_SECRET ||= 'test-secret-not-for-production-use-0123456789'
process.env.APP_URL = 'http://localhost:3000'
// The Resend SDK is mocked in every test that sends email; this fake key only
// enables the adapter's "configured" code path.
process.env.RESEND_API_KEY = 're_test_fake_key_never_valid'
process.env.EMAIL_FROM_ADDRESS = 'cms@example.test'
process.env.EMAIL_FROM_NAME = 'Arthanova Studio'
process.env.EMAIL_REPLY_TO = 'support@example.test'
process.env.EMAIL_DEV_OUTBOX = 'false'
delete process.env.EMAIL_OVERRIDE_RECIPIENT
process.env.S3_ENABLED = 'false'
process.env.JOBS_AUTORUN = 'false'
