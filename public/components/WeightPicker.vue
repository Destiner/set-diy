<template>
	<div>
		<div v-for="(token, i) in selectedTokens" class="asset">
			<img class="asset-icon" :src="getAsset(token).icon">
			{{ getAsset(token).ticker }}
			<input type="range" min="0" max="100" v-model="weights[i]">
			{{ getPercentage(i) }}
		</div>
	</div>
</template>

<script>
import daiIcon from '../assets/dai.svg';
import kncIcon from '../assets/knc.svg';
import manaIcon from '../assets/mana.png';
import mkrIcon from '../assets/mkr.svg';
import omgIcon from '../assets/omg.jpg';
import polyIcon from '../assets/poly.png';
import saltIcon from '../assets/salt.svg';
import sntIcon from '../assets/snt.svg';
import zilIcon from '../assets/zil.svg';

export default {
	props: ['selectedTokens', 'onChange'],
	data() {
		return {
			assets: [{
				ticker: 'KNC',
				address: '0xad67cB4d63C9da94AcA37fDF2761AaDF780ff4a2',
				icon: kncIcon,
			}, {
				ticker: 'DAI',
				address: '0xC4375B7De8af5a38a93548eb8453a498222C4fF2',
				icon: daiIcon,
			}, {
				ticker: 'MANA',
				address: '0xcb78b457c1F79a06091EAe744aA81dc75Ecb1183',
				icon: manaIcon,
			}, {
				ticker: 'MKR',
				address: '0xAaF64BFCC32d0F15873a02163e7E500671a4ffcD',
				icon: mkrIcon,
			}, {
				ticker: 'OMG',
				address: '0xdB7ec4E4784118D9733710e46F7C83fE7889596a',
				icon: omgIcon,
			}, {
				ticker: 'POLY',
				address: '0xd92266fd053161115163a7311067F0A4745070b5',
				icon: polyIcon,
			}, {
				ticker: 'SALT',
				address: '0x6fEE5727EE4CdCBD91f3A873ef2966dF31713A04',
				icon: saltIcon,
			}, {
				ticker: 'SNT',
				address: '0x4c99B04682fbF9020Fcb31677F8D8d66832d3322',
				icon: sntIcon,
			}, {
				ticker: 'ZIL',
				address: '0xAb74653cac23301066ABa8eba62b9Abd8a8c51d6',
				icon: zilIcon,
			}],
			weights: this.selectedTokens.map(token => 50),
		}
	},
	watch: {
		weights() {
			this.onChange(this.weights);
		}
	},
	methods: {
		getPercentage(index) {
			const weight = parseInt(this.weights[index]);
			const totalWeight = this.weights.reduce((a, v) => a + parseInt(v), 0);
			const share = weight / totalWeight;
			const percentage = share * 100;
			return `${percentage.toFixed(2)}%`;
		},
		getAsset(address) {
			const asset = this.assets.find((asset) => asset.address == address);
			return asset;
		}
	}
}
</script>

<style scoped>
.asset {
	margin-bottom: 0.5em;
}

.asset-icon {
	width: 16px;
}
</style>
