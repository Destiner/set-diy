<template>
	<div>
		<div>Set address: {{ address }}</div>
		<div class="panels">
			<div class="panel">
				<div>Ether balance: {{ ethBalance }}</div>
				<input name="buy" v-model="buyAmount">
				<button @click="buy">Buy</button>
			</div>
			<div class="panel">
				<div>Set balance: {{ setBalance }}</div>
				<input name="sell" v-model="sellAmount">
				<button @click="sell">Sell</button>
			</div>
		</div>
		<div class="events">
			<div v-for="event in events" class="event">
				{{ event }}
			</div>
		</div>
	</div>
</template>

<script>
import { ethers } from 'ethers';

import erc20Abi from '../abi/erc20.json';
import setBuyerAbi from '../abi/setBuyer.json';

const provider = new ethers.providers.Web3Provider(ethereum);
const signer = provider.getSigner();

const baseAmount = '1000000000000000000';

const setBuyerAddress = '0x2948b64dfa61c1d1c33218d7596f9acdd7dbb366';

export default {
	data() {
		return {
			address: '',
			buyAmount: 0,
			sellAmount: 0,
			ethBalance: 0,
			setBalance: 0,
			events: [],
		}
	},
	mounted() {
		this.address = this.$route.params.address;
		this.updateBalances();
		this.loadEvents();
	},
	methods: {
		async buy() {
			const setBuyerContract = new ethers.Contract(setBuyerAddress, setBuyerAbi, signer);
			const txOptions = {
				value: ethers.utils.parseEther(this.buyAmount.toString()),
			};
			const buyTx = await setBuyerContract.buy(this.address, txOptions);
			await provider.waitForTransaction(buyTx.hash);
			await this.updateBalances();
		},
		async sell() {
			const owner = await signer.getAddress();
			const uintMax = '115792089237316195423570985008687907853269984665640564039457584007913129639935';
			const setBuyerContract = new ethers.Contract(setBuyerAddress, setBuyerAbi, signer);
			// Approve
			const setContract = new ethers.Contract(this.address, erc20Abi, signer);
			const tokenAllowance = await setContract.allowance(owner, setBuyerAddress);
			if (tokenAllowance.isZero()) {
				const approveTx = await setContract.approve(setBuyerAddress, uintMax);
				await provider.waitForTransaction(approveTx.hash);
			}
			// Sell
			const sellAmountNumber = ethers.utils.parseEther(this.sellAmount.toString());
			const sellTx = await setBuyerContract.sell(this.address, sellAmountNumber);
			await provider.waitForTransaction(sellTx.hash);
			await this.updateBalances();
		},
		async updateBalances() {
			const account = await signer.getAddress();
			const ethBalance = await provider.getBalance(account);
			this.ethBalance = ethers.utils.formatEther(ethBalance).substring(0, 6);
			const setContract = new ethers.Contract(this.address, erc20Abi, signer);
			const setBalance = await setContract.balanceOf(account);
			this.setBalance = ethers.utils.formatEther(setBalance).substring(0, 6);
		},
		async loadEvents() {
			const query = `
				query {
					issuances(where: {setAddress: "${this.address}"}, orderBy: timestamp) {
						amount
						account
						timestamp
					}
					redemptions(where: {setAddress: "${this.address}"}, orderBy: timestamp) {
						amount
						account
						timestamp
					}
				}`;
			const url = "https://api.thegraph.com/subgraphs/name/destiner/set-protocol";
			const opts = {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ query })
			};
			const response = await fetch(url, opts);
			const json = await response.json();
			const data = json.data;
			for (const issuance of data.issuances) {
				const issuanceString = `Issued ${issuance.amount} by ${issuance.account} at ${issuance.timestamp}`;
				this.events.push(issuanceString);
			}
			for (const redemption of data.redemptions) {
				const redemptionString = `Redeemed ${redemption.amount} by ${redemption.account} at ${redemption.timestamp}`;
				this.events.push(redemptionString);
			}
		}
	}
}
</script>

<style>
.panels {
	display: flex;
}

.panel {
	margin: 2em;
}
</style>

