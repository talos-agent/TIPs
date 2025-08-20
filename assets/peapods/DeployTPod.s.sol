// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";

interface IDecentralizedIndex {
    struct Config {
        address partner;
        uint256 debondCooldown;
        bool hasTransferTax;
        bool blacklistTKNpTKNPoolV2; // DEPRECATED: we should remove this in future versions
    }

    // all fees: 1 == 0.01%, 10 == 0.1%, 100 == 1%
    struct Fees {
        uint16 burn;
        uint16 bond;
        uint16 debond;
        uint16 buy;
        uint16 sell;
        uint16 partner;
    }
}

interface ILeverageFactory {
    function createPodAndAddLvfSupport(
        address _borrowTkn,
        bytes memory _podConstructorArgs,
        bytes memory _aspTknOracleRequiredImmutables,
        bytes memory _aspTknOracleOptionalImmutables,
        bytes memory _fraxlendPairConfigData,
        bool _isSelfLending
    ) external returns (address _newPod, address _aspTkn, address _aspTknOracle, address _fraxlendPair);
}

contract DeployTLVFPod is Script {
    function run() external {
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));

        IDecentralizedIndex.Config memory _c;
        address[] memory _t = new address[](1);
        _t[0] = 0x30a538eFFD91ACeFb1b12CE9Bc0074eD18c9dFc9;
        uint256[] memory _w = new uint256[](1);
        _w[0] = 1e18;
        (address _pod,,,) = ILeverageFactory(0xf79E475e8f13F824aA9C9470a726E754da1Dd261).createPodAndAddLvfSupport(
            0xaf88d065e77c8cC2239327C5EDb3A432268e5831, // USDC
            abi.encode(
                "Talos LFV Pod",
                "pT",
                abi.encode(_c, _getFees(), _t, _w, address(0), false),
                _getImmutables(
                    0xaf88d065e77c8cC2239327C5EDb3A432268e5831, // USDC
                    0x98Bb5Ae50478d7e012326E067e1e49db1e59Fe39,
                    0x14940e0b3Fa7Ed05bAEb348c29864331D59396BA,
                    0xe8869F393d083bc41358b6C13B1eBce54fE11458,
                    0x22dc5B739B34F98bE2f2f262bD104ed9AB1AAD7A
                )
            ),
            abi.encode(
                0xAa95eeA9Afe4945966Bf66ca2393F0FC50cBd0A0,
                0x48B50c792D993A56cdF23B0AD64c257F2A3888a1,
                0x0D71e8487DF7Ed8ac111Bfab9CC44cC69bAC6653,
                0xaf88d065e77c8cC2239327C5EDb3A432268e5831, // USDC
                false,
                false,
                address(0),
                0xD971fF5a7530919ae67e06695710b262A72E8f2f
            ),
            abi.encode(
                address(0),
                0xB1026b8e7276e7AC75410F1fcbbe21796e8f7526, // Camelot Algebra USDC/WETH
                address(0),
                address(0),
                address(0),
                address(0),
                0xEC8a490000E9553A373E54ED71C09C7aA73EeAf8 // V2ReservesCamelot
            ),
            abi.encode(
                uint32(5000), // uint32 _maxOracleDeviation
                0x28dA3Fc407461aB231F5e80c78E23a76b5F0519d, // address _rateContract
                uint64(90000), // uint64 _fullUtilizationRate
                83333, // uint256 _maxLTV
                10000, // uint256 _liquidationFee
                1000, // uint256 _protocolLiquidationFee
                0 // uint256 _NOOP
            ),
            true
        );

        vm.stopBroadcast();

        console.log("Pod deployed to:", _pod);
    }

    function _getFees() internal pure returns (IDecentralizedIndex.Fees memory) {
        return IDecentralizedIndex.Fees({
            burn: uint16(4000),
            bond: uint16(100),
            debond: uint16(500),
            buy: uint16(500),
            sell: uint16(500),
            partner: uint16(0)
        });
    }

    function _getImmutables(
        address dai,
        address feeRouter,
        address rewardsWhitelist,
        address twapUtils,
        address dexAdapter
    ) internal pure returns (bytes memory) {
        return abi.encode(
            dai, 0x02f92800F57BCD74066F5709F1Daa1A4302Df875, dai, feeRouter, rewardsWhitelist, twapUtils, dexAdapter
        );
    }
}
