const sgMail = require('@sendgrid/mail');

const { SENDGRID_API_KEY } = require('../utils/config');
const Passcode = require('../models/passcode');

sgMail.setApiKey(SENDGRID_API_KEY);

const generatePasscode = (nthDigit = 7) => {
	let strPasscode = '';
	for (var i = 0; i < nthDigit; i++) {
		strPasscode += Math.floor(Math.random() * 10);
	}
	return Number(strPasscode);
}

const storePasscodeToDb = async (userId) => {
	const generatedPasscode = generatePasscode(7);
	const passcode = new Passcode({
		passcode: generatedPasscode,
		userId
	})

	await passcode.save();

	return generatedPasscode;
}

const generateEmailContent = (passcode) => {
	const text = `Thank you for your request to become a member of everyone\'s favorite clubhouse (definitely not lying).
	
	Copy and paste the following passcode: ${passcode}
	
	You only have 5 minutes or it'll expire`;
	return text;
}

async function sendPasscodeToEmail(user, options = {}) {
	const passcode = await storePasscodeToDb(user.id);

	const msg = {
		to: user.email,
		from: 'theironiccaveclubhouse@gmail.com',
		subject: `(${passcode}) - Verify now to become a member of The Ironic Cave Clubhouse`,
		text: generateEmailContent(passcode),
		...options
	};

	try {
		await sgMail.send(msg);
		console.log('Email sent');
	} catch (error) {
		console.error(`Error sending email: ${error}`);
	}
}

module.exports = {
	sendPasscodeToEmail
}