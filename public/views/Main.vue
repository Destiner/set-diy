<template>
	<div>
		Main view
		<div id="tokenPicker">
			<token-picker :onSelect="onTokenSelect"></token-picker>
		</div>
		<div>
			<button @click="create">Create</button>
		</div>
		<div>
			<button @click="invest">Invest with Ether</button>
		</div>
		<div>
			<button @click="dump">Dump</button>
		</div>
	</div>
</template>

<script>
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';

import setAbi from '../abi/set.json';
import erc20Abi from '../abi/erc20.json';
import kyberProxyAbi from '../abi/kyberProxy.json';
import setBuyerAbi from '../abi/setBuyer.json';

import TokenPicker from '../components/TokenPicker.vue';

const kyberProxyAddress = '0x692f391bcc85cefce8c237c01e1f636bbd70ea4d';
const setCoreAddress = '0x79c9eCb5c9a34d5FFd2aDc956AdCaFcC6F983234';
const factoryAddress = '0x8F43Ee43cE545193A79466642BC5FfF381036908';
const transferProxyAddress = '0x640f4F4AA4e4449F630d37801CAF5452b9462AC4';
const setBuyerAddress = '0x2948b64dfa61c1d1c33218d7596f9acdd7dbb366';

const ether = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
const baseAmount = '1000000000000000000';

const provider = new ethers.providers.Web3Provider(ethereum);
const signer = provider.getSigner();

export default {
	components: {
		TokenPicker,
	},
	data() {
		return {
			selectedTokens: [],
			setAddress: '', // FIXME setting existing set address breaks ether investing
		}
	},
	methods: {
		async create() {
			const setContract = new ethers.Contract(setCoreAddress, setAbi, signer);
			const units = await this._getUnits();
			console.log(units);
			const naturalUnit = '1000';
			const name = ethers.utils.formatBytes32String('DIY Set');
			const symbol = ethers.utils.formatBytes32String('DIY');
			const data = '0x0';
			const tx = await setContract.create(factoryAddress, this.selectedTokens, units, naturalUnit, name, symbol, data);
			const txReceipt = await provider.waitForTransaction(tx.hash);
			const setAddressData = txReceipt.logs[0].topics[1];
			this.setAddress = `0x${setAddressData.substring(26)}`;
		},
		// async invest() {
		// 	await this._approve();
		// 	await this._issue();
		// },
		async invest() {
			const setBuyerContract = new ethers.Contract(setBuyerAddress, setBuyerAbi, signer);
			const txOptions = {
				value: ethers.utils.parseEther('0.005'),
			};
			await setBuyerContract.buy(this.setAddress, txOptions);
		},
		async dump() {
			const owner = await signer.getAddress();
			const uintMax = '115792089237316195423570985008687907853269984665640564039457584007913129639935';
			const setBuyerContract = new ethers.Contract(setBuyerAddress, setBuyerAbi, signer);
			// Approve
			const setContract = new ethers.Contract(this.setAddress, erc20Abi, signer);
			const tokenAllowance = await setContract.allowance(owner, setBuyerAddress);
			console.log('tokenAllowance', tokenAllowance.toString());
			if (tokenAllowance.isZero()) {
				const approveTx = await setContract.approve(setBuyerAddress, uintMax);
				await provider.waitForTransaction(approveTx.hash);
			}
			// Get balance
			const setBalance = await setContract.balanceOf(owner);
			// Sell
			await setBuyerContract.sell(this.setAddress, setBalance);
		},
		// async redeem() {
		// 	const owner = await signer.getAddress();
		// 	const setContract = new ethers.Contract(this.setAddress, erc20Abi, signer);
		// 	// Get balance
		// 	const setBalance = await setContract.balanceOf(owner);
		// 	const excludeMask = '0';
		// 	console.log('setBalance', setBalance);
		// 	const setCoreContract = new ethers.Contract(setCoreAddress, setAbi, signer);
		// 	await setCoreContract.redeemAndWithdrawTo(this.setAddress, owner, setBalance, excludeMask);
		// },
		async _getUnits() {
			const kyberProxyContract = new ethers.Contract(kyberProxyAddress, kyberProxyAbi, provider);
			const dividor = new BigNumber('1e15');
			const units = [];
			for (const token of this.selectedTokens) {
				const rateResponse = await kyberProxyContract.getExpectedRate(ether, token, baseAmount);
				const price = rateResponse[0];
				const unit = price.div(dividor.toString()).toString();
				units.push(unit);
			}
			return units;
		},
		// async _approve() {
		// 	const uintMax = '115792089237316195423570985008687907853269984665640564039457584007913129639935';
		// 	const owner = await signer.getAddress();
		// 	let approveTx;
		// 	this.selectedTokens.forEach(async(token) => {
		// 		const tokenContract = new ethers.Contract(token, erc20Abi, signer);
		// 		const tokenAllowance = await tokenContract.allowance(owner, transferProxyAddress);
		// 		if (tokenAllowance.isZero()) {
		// 			approveTx = await tokenContract.approve(transferProxyAddress, uintMax);
		// 		}
		// 	});
		// 	if (approveTx) {
		// 		await provider.waitForTransaction(approveTx.hash);
		// 	}
		// },
		// async _issue() {
		// 	const setContract = new ethers.Contract(setCoreAddress, setAbi, signer);
		// 	const amount = '100000';
		// 	await setContract.issue(this.setAddress, amount);
		// },
		onTokenSelect(selectedTokens) {
			this.selectedTokens = selectedTokens;
		},
	}
}
</script>

<style>
#tokenPicker {
	padding-left: 20em;
	padding-right: 20em;
}
</style>
