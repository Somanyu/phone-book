import React, { useState } from 'react';
import { IconButton, Tooltip } from '@chakra-ui/react';
import { useQuery } from '@apollo/client';
import { GoSync } from 'react-icons/go';


// Config files
import { GetContactList } from '../config/queries';
import { Contact } from '../config/types';

type Props = {}

const RefreshButton = (props: Props) => {

    const [isLoading, setIsLoading] = useState(false);
    const { loading, error, data } = useQuery(GetContactList, {
        variables: {
            order_by: [{ created_at: 'desc' }] // Order by created_at in descending order
        },
        fetchPolicy: 'no-cache'
    });


    const handleButtonClick = () => {
        window.location.reload()
        if (!loading && !error && data) {
            localStorage.removeItem('contactList');
            setIsLoading(true);
            localStorage.setItem('contactList', JSON.stringify(data.contact));
            console.log('Data stored in local storage:', data?.contact);
        }
    };

    return (
        <div>
            <Tooltip hasArrow placement='top' label='Refresh contact list'>
                <IconButton onClick={handleButtonClick} mb={4} aria-label='Search database' icon={<GoSync color={isLoading ? 'green.500' : 'gray.500'} />} />
            </Tooltip>
        </div>
    )
}

export default RefreshButton