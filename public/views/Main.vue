<template>
	<div>
		<div id="tokenPicker" v-if="isPickingTokens">
			<token-picker :onSelect="onTokenSelect"></token-picker>
			<button @click="showWeights">Ready</button>
		</div>
		<div id="weightPicker" v-if="!isPickingTokens">
			<weight-picker :onChange="onWeightChange" :selectedTokens="selectedTokens"></weight-picker>
			<button @click="create">Create</button>
		</div>
	</div>
</template>

<script>
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';

import setAbi from '../abi/set.json';
import kyberProxyAbi from '../abi/kyberProxy.json';

import TokenPicker from '../components/TokenPicker.vue';
import WeightPicker from '../components/WeightPicker.vue';

const kyberProxyAddress = '0x692f391bcc85cefce8c237c01e1f636bbd70ea4d';
const setCoreAddress = '0x79c9eCb5c9a34d5FFd2aDc956AdCaFcC6F983234';
const factoryAddress = '0x8F43Ee43cE545193A79466642BC5FfF381036908';

const ether = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
const baseAmount = '1000000000000000000';

const provider = new ethers.providers.Web3Provider(ethereum);
const signer = provider.getSigner();

export default {
	components: {
		TokenPicker,
		WeightPicker,
	},
	data() {
		return {
			selectedTokens: [],
			weights: [],
			isPickingTokens: true,
		}
	},
	methods: {
		async showWeights() {
			this.isPickingTokens = false;
			this.weights = this.selectedTokens.map(token => 50);
		},
		async create() {
			await ethereum.enable();
			const setContract = new ethers.Contract(setCoreAddress, setAbi, signer);
			const units = await this._getUnits();
			const naturalUnit = '1000';
			const name = ethers.utils.formatBytes32String('DIY Set');
			const symbol = ethers.utils.formatBytes32String('DIY');
			const data = '0x0';
			const tx = await setContract.create(factoryAddress, this.selectedTokens, units, naturalUnit, name, symbol, data);
			const txReceipt = await provider.waitForTransaction(tx.hash);
			const setAddressData = txReceipt.logs[0].topics[1];
			const setAddress = `0x${setAddressData.substring(26)}`;
			this.$router.push({ path: `/set/${setAddress}`})
		},
		async _getUnits() {
			const kyberProxyContract = new ethers.Contract(kyberProxyAddress, kyberProxyAbi, provider);
			const dividor = new BigNumber('1e15');
			const units = [];
			const totalWeight = this.weights.reduce((a, v) => a + parseInt(v), 0);
			const tokenCount = this.selectedTokens.length;
			for (let i = 0; i < tokenCount; i++) {
				const token = this.selectedTokens[i];
				const rateResponse = await kyberProxyContract.getExpectedRate(ether, token, baseAmount);
				const price = rateResponse[0];
				const weightNumber = new BigNumber(this.weights[i]);
				const weight = weightNumber.times(tokenCount).div(totalWeight).times('100').toString();
				const unit = price.mul(weight).div('100').div(dividor.toString()).toString();
				units.push(unit);
			}
			return units;
		},
		onTokenSelect(selectedTokens) {
			this.selectedTokens = selectedTokens;
		},
		onWeightChange(weights) {
			this.weights = weights;
		}
	}
}
</script>

<style>
#tokenPicker {
	padding-left: 23em;
	padding-right: 23em;
	display: flex;
	flex-direction: column;
	align-items: center;
}

#weightPicker {
	padding-left: 23em;
	padding-right: 23em;
	display: flex;
	flex-direction: column;
	align-items: center;
}
</style>
