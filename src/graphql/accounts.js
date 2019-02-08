const { query, nullToUndefined } = require("../utils.js");

class Accounts {
	constructor({ graphUrl, context }) {
		this.graphUrl = graphUrl;
		this.context = context;
	}
	async find({ filter, options, fields, context }) {
		context = context || this.context;
		
		const variables = {
			filter,
			options
		};
		
		const response = await query({
			query : `
				query($filter: auth_accounts_filter, $options: auth_options) {
					auth {
						accounts(filter: $filter, options: $options) {
							${fields}
						}
					}
				}
			`,
			variables,
			url : this.graphUrl,
			token : context.token
		});
		
		const returnData = response.auth.accounts;
		
		nullToUndefined(returnData)
		
		return returnData;
	}
	async upsert({ input, fields, context }) {
		context = context || this.context;
		
		const variables = {
			input
		}
		
		const response = await query({
			query : `
				mutation($input: auth_accounts_upsert!) {
					auth {
						accounts_upsert(input: $input) {
							${fields}
						}
					}
				}
			`,
			variables,
			url : this.graphUrl,
			token : context.token
		});
		
		return response.auth.accounts_upsert;
	}
	async remove({ filter, fields, context }) {
		const method = `${this.name}_remove`;
		
		context = context || this.context;
		
		const variables = {
			filter,
			acct_id : context.acct_id
		}
		
		const response = await query({
			query : `
				mutation($acct_id: String!, $filter: admin_${method}_filter) {
					admin(acct_id: $acct_id {
						${method}(filter: $filter) {
							${fields}
						}
					}
				}
			`,
			variables,
			url : this.graphUrl,
			token : context.token
		});
	}
}

module.exports = Accounts;