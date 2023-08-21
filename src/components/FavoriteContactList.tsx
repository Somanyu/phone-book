import React from 'react'
import { Avatar, Badge, Stack, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverHeader, PopoverBody, Table, Thead, IconButton, Tbody, Tr, Th, Td, TableContainer, Tooltip, Text, Image, Flex } from '@chakra-ui/react'
import { GoHeart, GoPencil, GoTrash } from 'react-icons/go';
import { Pagination } from './ContactList';
import { Link } from 'react-router-dom';
import { css } from '@emotion/react';

// Config files
import { Contact } from '../config/types';

interface FavoriteContactListProps {
    contacts: Contact[];
    favoriteCurrentPage: number;
    pageSize: number;
    favoriteStartIndex: number;
    favoriteEndIndex: number;
    handleFavoritePageChange: (page: number) => void;
    removeFromFavorites: (id: any) => void;
    onOpenModal: (id: any) => void;
}


const FavoriteContactList: React.FC<FavoriteContactListProps> = ({
    contacts,
    favoriteCurrentPage,
    pageSize,
    favoriteStartIndex,
    favoriteEndIndex,
    handleFavoritePageChange,
    removeFromFavorites,
    onOpenModal,
}) => {

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
                    {contacts
                        .filter(contact => contact.isFavorite)
                        .slice(favoriteStartIndex, favoriteEndIndex)
                        .map(favoriteContact => (
                            <Tr key={favoriteContact.id}>

                                {/* Dicebear API for avatar */}
                                <Td><Avatar name={`${favoriteContact.first_name} ${favoriteContact.last_name}`} src={`https://api.dicebear.com/6.x/lorelei/svg?seed=${favoriteContact.first_name}`} /></Td>

                                {/* Contact's first name and last name */}
                                <Td>{favoriteContact.first_name} {favoriteContact.last_name}</Td>

                                <Td>
                                    {favoriteContact.phones && favoriteContact.phones.length > 0 ? (
                                        <Popover trigger='hover'>

                                            {/* Display first phone number in the array  */}
                                            <span>
                                                +{favoriteContact.phones[0].number}
                                                {favoriteContact.phones.length > 1 && (
                                                    <PopoverTrigger>
                                                        <Badge ml={2} variant='subtle' colorScheme='green'>
                                                            +{favoriteContact.phones.length - 1}
                                                        </Badge>
                                                    </PopoverTrigger>
                                                )}
                                            </span>

                                            {/* Display other phone numbers in the array */}
                                            <PopoverContent>
                                                <PopoverHeader fontWeight='semibold'>Other Numbers</PopoverHeader>
                                                <PopoverArrow />
                                                <PopoverBody>
                                                    {favoriteContact.phones.slice(1).map((phone, index) => (
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

                                        {/* Remove favorite */}
                                        <Tooltip hasArrow placement='top' label='Remove from favorites'>
                                            <IconButton onClick={() => removeFromFavorites(favoriteContact.id)} variant='solid' colorScheme='pink' aria-label='Add to favorites' icon={<GoHeart />} />
                                        </Tooltip>

                                        {/* Edit contact */}
                                        <Tooltip hasArrow placement='top' label='Edit contact'>
                                            <Link to={`/contact/edit/${favoriteContact.id}`}>
                                                <IconButton variant='outline' colorScheme='blue' aria-label='Edit contact' icon={<GoPencil />} />
                                            </Link>
                                        </Tooltip>

                                        {/* Delete contact */}
                                        <Tooltip hasArrow placement='top' label='Delete'>
                                            <IconButton css={deleteButton} onClick={() => onOpenModal(favoriteContact.id)} variant='solid' colorScheme='red' aria-label='Delete contact' icon={<GoTrash />} />
                                        </Tooltip>
                                    </Stack>
                                </Td>
                            </Tr>
                        ))}
                    {contacts.filter(contact => contact.isFavorite).length === 0 && (
                        <Tr>
                            <Td colSpan={4}>
                                <Flex justify="center" align="center">
                                    <Image boxSize="200px" src="/images/favorite.webp" alt="Add favorite" />
                                </Flex>
                                <Text css={primaryText} textAlign={'center'}>Add friends to brighten your favorites list!</Text>
                            </Td>
                        </Tr>
                    )}
                </Tbody>
            </Table>

            {/* Pagination component */}
            <Pagination
                currentPage={favoriteCurrentPage}
                totalPages={Math.ceil(contacts.filter(contact => contact.isFavorite).length / pageSize)}
                onPageChange={handleFavoritePageChange}
            />
        </TableContainer>
    )
}

export default FavoriteContactList