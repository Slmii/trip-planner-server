module.exports = {
	parser: '@typescript-eslint/parser', // Specifies the ESLint parser
	plugins: ['@typescript-eslint'],
	extends: [
		'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
		'prettier/@typescript-eslint' // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
	],
	parserOptions: {
		ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
		sourceType: 'module' // Allows for the use of imports
	},
	rules: {
		// Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
		'@typescript-eslint/no-inferrable-types': 'off',
		'@typescript-eslint/no-unused-vars': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off'
	}
};
