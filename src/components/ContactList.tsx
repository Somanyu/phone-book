import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { Avatar, Tooltip, Container, Tabs, TabList, TabPanels, Tab, TabPanel, Badge, Stack, Button, Center, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverHeader, PopoverBody, Table, Thead, IconButton, Tbody, Tr, Th, Td, TableContainer, Card, CardBody, Heading, HStack, useDisclosure, InputGroup, Input, InputLeftElement } from '@chakra-ui/react'
import { GoTrash, GoSearch, GoPencil, GoHeart, GoPersonAdd } from "react-icons/go";
import { css } from '@emotion/react';


// Config files
import client from '../config/apolloClient';
import { GetContactList } from '../config/queries';
import { Contact } from '../config/types';

// Components
import FavoriteContactList from './FavoriteContactList';
import ContactDeleteDialog from './ContactDeleteDialog';
import RefreshButton from './RefreshButton';


const ContactList = () => {

    const [selectedContactId, setSelectedContactId] = useState<number | null>(null); // State to manage selected contact ID
    const [contacts, setContacts] = useState<Contact[]>([]); // State to manage contact list
    const [currentPage, setCurrentPage] = useState<number>(1); // State to handle pagination
    const [favoriteCurrentPage, setFavoriteCurrentPage] = useState<number>(1); // State to manage favorite list 
    const { isOpen, onOpen, onClose } = useDisclosure(); // Chakra UI disclosure hooks for modal
    const [searchQuery, setSearchQuery] = useState<string>(""); // State to handle search functionality
    const pageSize = 10; // Number of rows per page

    // Fetch contacts from local storage if available; otherwise, fetch from the API
    const getContacts = async () => {
        // Retrieve contacts from localStorage or initialize an empty array if none are found
        const storedContacts = JSON.parse(localStorage.getItem('contactList') || '[]');

        // Check if there are stored contacts in local storage
        if (storedContacts.length > 0) {
            // Retrieve favorite contacts from localStorage, or initialize an empty array if none are found
            const storedFavorites = JSON.parse(localStorage.getItem('favoriteContacts') || '[]');

            // Merge the stored favorites with the fetched contacts
            const updatedContacts = storedContacts.map((contact: any) => ({
                ...contact,
                isFavorite: storedFavorites.includes(contact.id),
            }));

            setContacts(updatedContacts);
        } else {
            try {
                // Fetch contacts from the GraphQL API
                const { data } = await client.query({
                    query: GetContactList,
                    variables: {
                        order_by: [{ created_at: 'desc' }] // Order by created_at in descending order
                    }
                });

                // Update the state with the fetched contacts
                setContacts(data.contact);

                // Store the fetched contacts in local storage for future use
                // localStorage.setItem('contactList', JSON.stringify(data.contact));
            } catch (error) {
                console.error('Error fetching contacts from API:', error);
            }
        }
    };


    // Add a contact to favorites
    const addToFavorites = (contactId: any) => {
        const updatedContacts = contacts.map(contact => {
            if (contact.id === contactId) {
                return { ...contact, isFavorite: true };
            }
            return contact;
        });
        setContacts(updatedContacts);

        // Update favorites in localStorage.
        const favoriteIds = updatedContacts.filter(contact => contact.isFavorite).map(contact => contact.id);
        localStorage.setItem('favoriteContacts', JSON.stringify(favoriteIds));
    };

    // Remove a contact from favorites
    const removeFromFavorites = (contactId: any) => {
        const updatedContacts = contacts.map(contact => {
            if (contact.id === contactId) {
                return { ...contact, isFavorite: false };
            }
            return contact;
        });
        setContacts(updatedContacts);

        // Update favorites in localStorage.
        const favoriteIds = updatedContacts.filter(contact => contact.isFavorite).map(contact => contact.id);
        localStorage.setItem('favoriteContacts', JSON.stringify(favoriteIds));
    };


    // Filter contacts based on search query
    const filteredContacts = contacts.filter(contact =>
        contact.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (contact.phones && contact.phones.some(phone => phone.number.includes(searchQuery)))
    );


    // Fetch contacts from local storage or GraphQL API when the component mounts
    useEffect(() => {
        const storedContacts = localStorage.getItem('contacts');
        if (storedContacts) {
            // Parse and set the contacts from local storage
            setContacts(JSON.parse(storedContacts));
        } else {
            // Fetch the contacts from the GraphQL API
            getContacts();
        }
    }, []);

    // useEffect(() => {
    //     getContacts();
    // }, []);

    // Pagination calculation for contact list
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    // Pagination for favorite contact
    const favoriteStartIndex = (favoriteCurrentPage - 1) * pageSize;
    const favoriteEndIndex = favoriteStartIndex + pageSize;

    // Handle page changes
    const handleFavoritePageChange = (newFavoritePage: number) => {
        setFavoriteCurrentPage(newFavoritePage);
    }

    // Open contact modal
    const onOpenModal = (contactId: number) => {
        setSelectedContactId(contactId);
        onOpen();
    };

    const addContactHeading = css`
        font-family: 'Roboto', sans-serif;
        font-weight: 500;
    `
    const addContactButton = css`
        font-family: 'Nunito', sans-serif;
        font-weight: 300;
        &:hover {
            box-shadow: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px;
        }
    `

    const secondaryText = css`
        font-family: 'Nunito', sans-serif;
    `
    
    const primaryText = css`
        font-family: 'Roboto', sans-serif;
    `
    
    const deleteButton = css`
        &:hover {
            box-shadow: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px;
        }
    `


    return (
        <div>
            <HStack mb={10} mt={'10'} justify={'center'}>
                <Heading as='h3' size='2xl' css={addContactHeading} textAlign={'center'}>Contact List</Heading>
                <Link to='/contact/add'>
                    <Button css={addContactButton} size={'sm'} ml={'3'} leftIcon={<GoPersonAdd />} colorScheme='whatsapp' variant='solid'>
                        Add Contact
                    </Button>
                </Link>
            </HStack>

            {/* Search input */}
            <Container>
                <HStack>
                    <InputGroup mb={4} size='md'>
                        <Input
                            pr='4.5rem'
                            css={secondaryText}
                            type={'text'}
                            value={searchQuery}
                            placeholder='Search contacts'
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <InputLeftElement pointerEvents='none'>
                            <GoSearch color='gray.300' />
                        </InputLeftElement>
                    </InputGroup>
                    <RefreshButton />
                </HStack>
            </Container>

            <Center>
                <Card>
                    <CardBody>
                        <Tabs isFitted variant='line'>
                            <TabList>
                                <Tab css={primaryText}>Contact List</Tab>
                                <Tab css={primaryText}>Favorite Contacts</Tab>
                            </TabList>
                            <TabPanels>

                                {/* Contact List */}
                                <TabPanel>
                                    <TableContainer>
                                        <Table variant='simple'>
                                            <Thead>
                                                <Tr>
                                                    <Th css={primaryText}>Profile</Th>
                                                    <Th css={primaryText}>Name</Th>
                                                    <Th css={primaryText}>Phone Numbers</Th>
                                                    <Th css={primaryText} textAlign={'center'}>Actions</Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody css={secondaryText}>
                                                {filteredContacts
                                                    .slice(startIndex, endIndex)
                                                    .map((contact) => {
                                                        const isFavorite = contact.isFavorite; // Check if the contact is in the favorite list
                                                        return (
                                                            <Tr key={contact.id}>

                                                                {/* Dicebear API for avatar */}
                                                                <Td><Avatar name={`${contact.first_name} ${contact.last_name}`} src={`https://api.dicebear.com/6.x/lorelei/svg?seed=${contact.first_name}`} /></Td>

                                                                {/* Contact's first name and last name */}
                                                                <Td>{contact.first_name} {contact.last_name}</Td>

                                                                <Td>
                                                                    {contact.phones && contact.phones.length > 0 ? (
                                                                        <Popover trigger='hover'>

                                                                            {/* Display first phone number in the array  */}
                                                                            <span>
                                                                                +{contact.phones[0].number}
                                                                                {contact.phones.length > 1 && (
                                                                                    <PopoverTrigger>
                                                                                        <Badge ml={2} variant='subtle' colorScheme='green'>
                                                                                            +{contact.phones.length - 1}
                                                                                        </Badge>
                                                                                    </PopoverTrigger>
                                                                                )}
                                                                            </span>

                                                                            {/* Display other phone numbers in the array */}
                                                                            <PopoverContent>
                                                                                <PopoverHeader fontWeight='semibold'>Other Numbers</PopoverHeader>
                                                                                <PopoverArrow />
                                                                                <PopoverBody>
                                                                                    {contact.phones.slice(1).map((phone, index) => (
                                                                                        <div key={index}>+{phone.number}</div>
                                                                                    ))}
                                                                                </PopoverBody>
                                                                            </PopoverContent>
                                                                        </Popover>
                                                                    ) : (
                                                                        'No phone number'
                                                                    )}
                                                                </Td>

                                                                <Td>
                                                                    <Stack direction='row' spacing={4}>
                                                                        {isFavorite ? (
                                                                            <Tooltip hasArrow placement='top' label='Remove from favorites'>
                                                                                {/* Remove favorite */}
                                                                                <IconButton onClick={() => removeFromFavorites(contact.id)} variant='solid' colorScheme='pink' aria-label='Remove from favorites' icon={<GoHeart />} />
                                                                            </Tooltip>
                                                                        ) : (
                                                                            <Tooltip hasArrow placement='top' label='Add to favorites'>
                                                                                {/* Add favorite */}
                                                                                <IconButton onClick={() => addToFavorites(contact.id)} variant='ghost' colorScheme='pink' aria-label='Add to favorites' icon={<GoHeart />} />
                                                                            </Tooltip>
                                                                        )}
                                                                        <Tooltip hasArrow placement='top' label='Edit contact'>
                                                                            {/* Edit contact */}
                                                                            <Link to={`/contact/edit/${contact.id}`}>
                                                                                <IconButton variant='outline' colorScheme='blue' aria-label='Edit contact' icon={<GoPencil />} />
                                                                            </Link>
                                                                        </Tooltip>
                                                                        <Tooltip hasArrow placement='top' label='Delete'>
                                                                            {/* Delete contact */}
                                                                            <IconButton css={deleteButton} onClick={() => onOpenModal(contact.id)} variant='solid' colorScheme='red' aria-label='Delete contact' icon={<GoTrash />} />
                                                                        </Tooltip>
                                                                    </Stack>
                                                                </Td>

                                                                {/* Confirmation for dialog for deleting a contact */}
                                                                <ContactDeleteDialog
                                                                    isOpen={isOpen}
                                                                    onClose={onClose}
                                                                    selectedContactId={selectedContactId}
                                                                    contacts={contacts}
                                                                />

                                                            </Tr>
                                                        );
                                                    })}
                                            </Tbody>
                                        </Table>

                                        {/* Pagination component */}
                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={Math.ceil(filteredContacts.length / pageSize)}
                                            onPageChange={handlePageChange}
                                        />
                                    </TableContainer>
                                </TabPanel>

                                {/* Favorite Contact List */}
                                <TabPanel>
                                    <FavoriteContactList
                                        contacts={contacts}
                                        favoriteCurrentPage={favoriteCurrentPage}
                                        pageSize={pageSize}
                                        favoriteStartIndex={favoriteStartIndex}
                                        favoriteEndIndex={favoriteEndIndex}
                                        handleFavoritePageChange={handleFavoritePageChange}
                                        removeFromFavorites={removeFromFavorites}
                                        onOpenModal={onOpenModal}
                                    />
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </CardBody>
                </Card>

            </Center>

            <Center>

            </Center>
        </div>
    )
}

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (newPage: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <Stack direction='row' align='center' justify='center' mt={4}>
            {pageNumbers.map((pageNumber) => (
                <Button
                    variant={currentPage === pageNumber ? 'solid' : 'outline'}
                    size={'sm'}
                    key={pageNumber}
                    colorScheme={currentPage === pageNumber ? 'blue' : 'gray'}
                    onClick={() => onPageChange(pageNumber)}
                >
                    {pageNumber}
                </Button>
            ))}
        </Stack>
    );
};

export default ContactList;