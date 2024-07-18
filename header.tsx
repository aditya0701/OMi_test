import { ReactElement, SetStateAction, useState } from 'react';
import Select, { SingleValue } from "react-select";
import styles from './header.module.css'
import { CohortProvider, useCohorts } from '../stores/cohorts-store';

export function Header() : ReactElement{
    // Storage for the cohorts
    const cohortProvider : CohortProvider = new CohortProvider();

    // Statef for the loading button
    const [loading, setLoading] = useState<boolean>(false);

    // State for an error message
    const [error, setError] = useState<string>("");

    // All event logs that are available in Celonis
    const options = [
        { value: 'el__PurchaseOrderItemActivities', label: 'PurchaseOrderItemActivities'},
        { value: 'el_celonis_Contract', label: 'Contract'},
        { value: 'el_celonis_ContractItem', label: 'ContractItem'},
        { value: 'el_celonis_IncomingMaterialDocumentItem', label: 'IncomingMaterialDocumentItem'},
        { value: 'el_celonis_OutgoingMaterialDocumentItem', label: 'OutgoingMaterialDocumentItem'},
        { value: 'el_celonis_PurchaseOrder', label: 'PurchaseOrder'},
        { value: 'el_celonis_PurchaseOrderItem', label: 'PurchaseOrderItem'},
        { value: 'el_celonis_PurchaseOrderScheduleLine', label: 'PurchaseOrderScheduleLine'},
        { value: 'el_celonis_PurchaseRequisitionItem', label: 'PurchaseRequisitionItem'},
        { value: 'el_celonis_VendorAccountCreditItem', label: 'VendorAccountCreditItem'},
        { value: 'el_celonis_VendorAccountCreditItemBlock', label: 'VendorAccountCreditItemBlock'},
        { value: 'el_celonis_VendorConfirmation', label: 'VendorConfirmation'},
        { value: 'el_celonis_VendorInvoice', label: 'VendorInvoice'},
        { value: 'el_celonis_VendorInvoiceItem', label: 'VendorInvoiceItem'},
      ];

    // States for parameters for the request
    const [selectedEventlog, setSelectedEventlog] = useState<string>(options[6].value);
    const [k, setK] = useState(1);
    const [alpha, setAlpha] = useState(0.0001);
    const [max_cohorts, setMax_cohorts] = useState(4);
    const [phi, setPhi] = useState(2);

    // State to abort the request
    const [abortController, setAbortController] = useState<AbortController>();
    
    // Style for the Select property
    const customStyles = {
        control: (provided) => ({
          ...provided,
          background: 'transparent',
          display: 'flex',
          flexWrap: 'nowrap',
          marginRight: "10px",
          
          
        }),
        menu: (provided) => ({
          ...provided,
          background: '#333',
          width: "auto"
        }),
        singleValue: (provided) => ({
            ...provided,
            color: "white"
        }),
        option: (provided, state) => ({
            ...provided,
            background: state.isSelected ? 'blue' : state.isFocused ? "#646a73" : undefined,
            '&:hover': {
                background: state.isSelected ? 'blue' : '#646a73', // Adjusted hover background color
                color: 'white' // Adjusted hover text color
                }
        }),
    };

    // Function to handle the button click
    // Request Cohorts based on the states 
    const handleButtonClick = async () => {
        setError("")
        // Controller to allow to cancle the request
        const controller = new AbortController();
        setAbortController(controller);

        try {
          setLoading(true)
          await cohortProvider.fetch_cohorts(selectedEventlog, k, alpha, max_cohorts, phi, controller.signal)
          setLoading(false)

        } catch (error) {
            if (error.message === 'Aborted') {
              console.log('Operation aborted');
              setLoading(false)
              setError(error.message)

            } else {
              console.error('Error in custom function:', error);
              setLoading(false)
              setError(error.message)
            }
            
            
        }
    };
    
    // Function to change the current selected EventLog
    const handleSelectChange = (currentOption: SingleValue<{ value: string; label: string }>) => {
      console.log(currentOption)    
      if (currentOption != null){
            console.log(currentOption)
            setSelectedEventlog(currentOption.value);
        }
      };
    // Function to handle the Cancle Click
    const handleCancelClick = () => {
      if (abortController) {
        abortController.abort();
        setAbortController(null);
        setLoading(false);
      }
    };

    return (
        <header className={styles.header}>
          <div className={styles.controlPanel}>
            <Select
                options={options}
                onChange={handleSelectChange}
                styles={customStyles}
                defaultValue={options[6]}

            />
            <div className={styles.inputContainer}>
              <text className={styles.text}>K: </text>
              <input
                type="number"
                value={k}
                onChange={(e) => setK(Number(e.target.value))}
                className={styles.input}
              />
              <text className={styles.text}>Alpha: </text>
              <input
                type="number"
                value={alpha}
                onChange={(e) => setAlpha(Number(e.target.value))}
                className={styles.input}
              />
              <text className={styles.text}>Max Cohorts: </text>
              <input
                type="number"
                value={max_cohorts}
                onChange={(e) => setMax_cohorts(Number(e.target.value))}
                className={styles.input}
              />
              <text className={styles.text}>Phi: </text>
              <input
                type="number"
                value={phi}
                onChange={(e) => setPhi(Number(e.target.value))}
                className={styles.input}
              />
            </div>
            <button onClick={handleButtonClick} className={styles.button}>Fetch Cohorts</button>
            <button onClick={handleCancelClick} className={styles.button}>Cancel</button>
            <div>
              {loading ? (
                <div className={styles.loading_container}>
                  <div className={styles.spinner}></div>
                </div>
              ):<div></div>}
            </div>
            <div>
              {error !== "" ? (
                <text className={styles.errorText}>There was an Error: {error}</text>
              ):<div></div>}
            </div>
          </div>
        </header>
    );
};