import ethIcon from '@/assets/img/eth.svg';
import dotIcon from '@/assets/img/dot.svg';
import atomIcon from '@/assets/img/atom.svg';
import terraIcon from '@/assets/img/terra.svg';
import avalancheIcon from '@/assets/img/avalanche.svg';
import minaIcon from '@/assets/img/mina.svg';

export const DEFAULT_VALIDATOR = {
  'mainnet-beta': {
    idPubkey: '8yjHdsCgx3bp2zEwGiWSMgwpFaCSzfYAHT1vk7KJBqhN',
    voterKey: 'DPmsofVJ1UMRZADgwYAHotJnazMwohHzRHSoomL6Qcao',
  },
  // is random validator for testnet
  testnet: {
    idPubkey: '75A6FVv8hAZn3n4KsTkURtQP7GDU4SDiZxcTzkTHZM3b',
    voterKey: 'BcX6qjy6fxYSHPyRmy5uJV6Z9MzK8v5ZS8UUiREoEYWW',
  },
};

export const LAUNCH_VALIDATORS = [
  {
    title: 'Etherium 2.0',
    id: 'ethereum',
    icon: ethIcon,
  },
  {
    title: 'Polkadot',
    id: 'polkadot',
    icon: dotIcon,
  },
  {
    title: 'Cosmos',
    id: 'cosmos',
    icon: atomIcon,
  },
  {
    title: 'Terra',
    id: 'terracoin',
    icon: terraIcon,
  },
  {
    title: 'Avalanche',
    id: 'avalanche-2',
    icon: avalancheIcon,
  },
  {
    title: 'Mina',
    id: 'mina-protocol',
    icon: minaIcon,
  },
];
