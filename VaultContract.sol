pragma solidity ^0.8.20;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.0.0/contracts/token/ERC20/IERC20.sol";

contract VaultContract {
    event TokenDepositedForPayment(
        address fromUser,
        address toRecipient,
        address tokenContract,
        uint256 tokenAmount,
        uint256 paymentAmountInWei
    );

    function depositForPayment(
        address toRecipient,
        address tokenContractAddress,
        uint256 tokenAmount,
        uint256 paymentAmountInWei
    ) public {
        IERC20 stockToken = IERC20(tokenContractAddress);
        require(
            stockToken.transferFrom(msg.sender, address(this), tokenAmount),
            "Token transfer failed. User must approve the transfer first."
        );
        emit TokenDepositedForPayment(
            msg.sender,
            toRecipient,
            tokenContractAddress,
            tokenAmount,
            paymentAmountInWei
        );
    }
}
