<template>
	<div id="assets">
		<div v-for="asset in assets" class="asset-card" :class="{ 'asset-card-selected': asset.selected }" @click="toggle(asset)">
			<img :src="asset.icon" class="asset-icon">
			{{asset.ticker}}
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
	props: ['onSelect'],
	data() {
		return {
			assets: [{
				ticker: 'KNC',
				address: '0xad67cB4d63C9da94AcA37fDF2761AaDF780ff4a2',
				icon: kncIcon,
				selected: false,
			}, {
				ticker: 'DAI',
				address: '0xC4375B7De8af5a38a93548eb8453a498222C4fF2',
				icon: daiIcon,
				selected: false,
			}, {
				ticker: 'MANA',
				address: '0xcb78b457c1F79a06091EAe744aA81dc75Ecb1183',
				icon: manaIcon,
				selected: false,
			}, {
				ticker: 'MKR',
				address: '0xAaF64BFCC32d0F15873a02163e7E500671a4ffcD',
				icon: mkrIcon,
				selected: false,
			}, {
				ticker: 'OMG',
				address: '0xdB7ec4E4784118D9733710e46F7C83fE7889596a',
				icon: omgIcon,
				selected: false,
			}, {
				ticker: 'POLY',
				address: '0xd92266fd053161115163a7311067F0A4745070b5',
				icon: polyIcon,
				selected: false,
			}, {
				ticker: 'SALT',
				address: '0x6fEE5727EE4CdCBD91f3A873ef2966dF31713A04',
				icon: saltIcon,
				selected: false,
			}, {
				ticker: 'SNT',
				address: '0x4c99B04682fbF9020Fcb31677F8D8d66832d3322',
				icon: sntIcon,
				selected: false,
			}, {
				ticker: 'ZIL',
				address: '0xAb74653cac23301066ABa8eba62b9Abd8a8c51d6',
				icon: zilIcon,
				selected: false,
			}],
		}
	},
	methods: {
		toggle(asset) {
			asset.selected = !asset.selected;
			const selectedTokens = this.assets
				.filter(asset => asset.selected)
				.map(asset => asset.address);
			this.onSelect(selectedTokens);
		}
	}
}
</script>

<style>
#assets {
	display: flex;
	flex-wrap: wrap;
}

.asset-card {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 2em 3em 2em 3em;
	border: 1px solid black;
	margin: 1em;
	cursor: pointer;
}

.asset-card-selected {
	background: #52b752;
}

.asset-icon {
	width: 50px;
	padding-bottom: 0.5em;
}
</style>
