import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { suiContractService } from '../services/sui-contract';

export const useSuiContract = () => {
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  const createInsurancePolicy = async (fieldData: any, premium: number) => {
    return await suiContractService.createInsurancePolicy(fieldData, premium);
  };

  const getPoolStats = async () => {
    return await suiContractService.getPoolStats();
  };

  const submitClaim = async (policyId: string, claimData: any) => {
    return await suiContractService.submitClaim(policyId, claimData);
  };

  return {
    createInsurancePolicy,
    getPoolStats,
    submitClaim,
  };
};

