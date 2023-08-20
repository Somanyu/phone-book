import React, { useState, useEffect } from 'react';
import { Input, useToast, FormControl, FormLabel, Center, Card, CardBody, Grid, Heading, GridItem, Flex, Button, Spacer, FormErrorMessage, HStack, ButtonGroup, Popover, PopoverTrigger, IconButton, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverHeader, PopoverBody } from '@chakra-ui/react'
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import PhoneInput from 'react-phone-input-2';
import { useMutation } from '@apollo/client';

import 'react-phone-input-2/lib/style.css';

// Config files
import { GetContactDetail, EditContactById, EditPhoneNumber } from '../config/queries';
import { Contact } from '../config/types';
import { GoArrowLeft, GoCheck, GoPencil } from 'react-icons/go';
import { Field, Form, Formik } from 'formik';

type Props = {}

const EditContact = (props: Props) => {
    const { id } = useParams<{ id: string }>();

    const toast = useToast();

    const [contact, setContact] = useState<Contact | null>(null);
    const [updateContact] = useMutation(EditContactById);

    // State to track the currently edited phone number
    const [editingPhoneNumber, setEditingPhoneNumber] = useState('');

    // Define the mutation function
    const [editPhoneNumberMutation] = useMutation(EditPhoneNumber);

    const validateFirstName = (value: string) => {
        let error: string | undefined;

        if (!value) {
            error = 'First name is required';
        } else if (!/^[A-Za-z]+$/.test(value)) {
            error = 'Only letters are allowed';
        } else if (value.length < 3 || value.length > 20) {
            error = 'First name must be between 3 and 20 characters';
        }
        return error;
    };

    const validateLastName = (value: string) => {
        let error: string | undefined;

        if (!value) {
            error = 'Last name is required';
        } else if (!/^[A-Za-z]+$/.test(value)) {
            error = 'Only letters are allowed';
        } else if (value.length < 3 || value.length > 20) {
            error = 'Last name must be between 3 and 20 characters';
        }
        return error;
    };

    const { loading, error, data } = useQuery(GetContactDetail, {
        variables: { id },
        fetchPolicy: 'network-only',
    });

    useEffect(() => {
        if (!loading && !error && data) {
            setContact(data.contact_by_pk);
        }
    }, [loading, error, data]);

    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            {contact ? (
                <React.Fragment>
                    <Heading mb={10} mt={10} textAlign={'center'}>Edit {contact?.first_name || ""} Contact</Heading>
                    <Center>
                        <Card>
                            <CardBody>

                                <Formik
                                    initialValues={{
                                        first_name: contact?.first_name || '',
                                        last_name: contact?.last_name || '',
                                        phoneNumbers: contact?.phones.map((phone) => phone.number) || []
                                    }}
                                    onSubmit={async (values) => {

                                        try {
                                            const updatedData = await updateContact({
                                                variables: {
                                                    id: contact.id,
                                                    _set: {
                                                        first_name: values.first_name,
                                                        last_name: values.last_name,
                                                        // phones: values.phoneNumbers.map((number) => ({ number })),
                                                    }
                                                }
                                            })

                                            if (updatedData && updatedData.data && updatedData.data.update_contact_by_pk) {
                                                // Show toast for successful contact update
                                                toast({
                                                    title: 'Contact Updated',
                                                    description: 'Contact has been successfully updated.',
                                                    status: 'success',
                                                    position: 'top',
                                                    duration: 3500,
                                                    isClosable: true,
                                                });
                                            }
                                        } catch (error) {
                                            console.error('Error updating contact: ', error);
                                            // Show toast for unsuccessful contact update
                                            toast({
                                                title: 'Error occurred',
                                                description: `${error}`,
                                                status: 'error',
                                                position: 'top',
                                                duration: 4000,
                                                isClosable: true,
                                            });
                                        }
                                    }}
                                >
                                    {({ values, handleSubmit, setFieldValue }) => (
                                        <Form>
                                            <Grid templateColumns='repeat(2, 1fr)' gap={4} mb={3}>
                                                <GridItem>
                                                    <Field name='first_name' validate={validateFirstName}>
                                                        {({ field, form }: any) => (
                                                            <FormControl isInvalid={form.errors.first_name && form.touched.first_name} isRequired>
                                                                <FormLabel>First name</FormLabel>
                                                                <Input {...field} isRequired={true} value={field.value || ''} />
                                                                <FormErrorMessage>{form.errors.first_name}</FormErrorMessage>
                                                            </FormControl>
                                                        )}
                                                    </Field>
                                                </GridItem>
                                                <GridItem>
                                                    <Field name='last_name' validate={validateLastName}>
                                                        {({ field, form }: any) => (
                                                            <FormControl isInvalid={form.errors.last_name && form.touched.last_name} isRequired>
                                                                <FormLabel>Last name</FormLabel>
                                                                <Input {...field} isRequired={true} value={field.value || ''} />
                                                                <FormErrorMessage>{form.errors.last_name}</FormErrorMessage>
                                                            </FormControl>
                                                        )}
                                                    </Field>
                                                </GridItem>
                                            </Grid>

                                            <Grid templateColumns='repeat(5, 2fr)' gap={4}>

                                                <GridItem colSpan={3}>
                                                    <FormControl isReadOnly>
                                                        <FormLabel>Phone number</FormLabel>
                                                        {contact?.phones.map((phone, index) => (
                                                            <div key={index}>
                                                                <HStack>
                                                                    <PhoneInput
                                                                        value={phone.number}
                                                                        containerStyle={{ marginTop: '3.5px' }}
                                                                        inputStyle={{
                                                                            height: '2.5rem',
                                                                            fontSize: '1rem',
                                                                            borderRadius: '0.375rem',
                                                                            borderColor: 'inherit',
                                                                            background: 'inherit'
                                                                        }}
                                                                    />

                                                                    <Popover trigger='click' placement='right'>
                                                                        <PopoverTrigger>
                                                                            <IconButton size={'md'} aria-label='Edit contact' icon={<GoPencil />} />
                                                                        </PopoverTrigger>
                                                                        <PopoverContent>
                                                                            <PopoverArrow />
                                                                            <PopoverCloseButton />
                                                                            <PopoverHeader>Update number</PopoverHeader>
                                                                            <PopoverBody>
                                                                                <>
                                                                                    <FormControl isRequired>
                                                                                        <FormLabel>Phone Number</FormLabel>
                                                                                        <PhoneInput
                                                                                            country="in"
                                                                                            placeholder="Enter phone number"
                                                                                            countryCodeEditable={false}
                                                                                            containerStyle={{ marginTop: '3.5px' }}
                                                                                            inputStyle={{
                                                                                                height: '2.5rem',
                                                                                                fontSize: '1rem',
                                                                                                borderRadius: '0.375rem',
                                                                                                borderColor: 'inherit',
                                                                                                background: 'inherit',
                                                                                            }}
                                                                                            value={phone.number}
                                                                                            onChange={(value) => setEditingPhoneNumber(value)}
                                                                                        />
                                                                                    </FormControl>
                                                                                    <ButtonGroup mt={2} display='flex' justifyContent='flex-end'>
                                                                                        <Button
                                                                                            type='button'
                                                                                            size={'sm'}
                                                                                            colorScheme='whatsapp'
                                                                                            onClick={async () => {
                                                                                                try {
                                                                                                    const updatedData = await editPhoneNumberMutation({
                                                                                                        variables: {
                                                                                                            pk_columns: {
                                                                                                                contact_id: contact.id,
                                                                                                                number: phone.number
                                                                                                            },
                                                                                                            new_phone_number: editingPhoneNumber 
                                                                                                        }
                                                                                                    });

                                                                                                    if (updatedData && updatedData.data && updatedData.data.update_phone_by_pk) {
                                                                                                        // Show toast for successful phone number update
                                                                                                        toast({
                                                                                                            title: 'Phone Number Updated',
                                                                                                            description: 'Phone number has been successfully updated.',
                                                                                                            status: 'success',
                                                                                                            position: 'top',
                                                                                                            duration: 3500,
                                                                                                            isClosable: true,
                                                                                                        });
                                                                                                    }
                                                                                                } catch (error) {
                                                                                                    console.error('Error updating phone number: ', error);
                                                                                                    // Show toast for unsuccessful phone number update
                                                                                                    toast({
                                                                                                        title: 'Error occurred',
                                                                                                        description: `${error}`,
                                                                                                        status: 'error',
                                                                                                        position: 'top',
                                                                                                        duration: 4000,
                                                                                                        isClosable: true,
                                                                                                    });
                                                                                                }
                                                                                            }}
                                                                                        >
                                                                                            Update
                                                                                        </Button>
                                                                                    </ButtonGroup>
                                                                                </>
                                                                            </PopoverBody>
                                                                        </PopoverContent>
                                                                    </Popover>

                                                                </HStack>
                                                            </div>
                                                        ))}
                                                    </FormControl>
                                                </GridItem>
                                            </Grid>
                                            <Flex mt={10}>
                                                <Link to='/'>
                                                    <Button leftIcon={<GoArrowLeft />} colorScheme='red' variant='ghost'>
                                                        Contact list
                                                    </Button>
                                                </Link>
                                                <Spacer />
                                                <Button isLoading={loading} leftIcon={<GoCheck />} type='submit' colorScheme='whatsapp' >
                                                    Update
                                                </Button>
                                            </Flex>

                                        </Form>
                                    )}
                                </Formik>

                            </CardBody>
                        </Card>
                    </Center>
                </React.Fragment>
            ) : (
                <p>loading...</p>
            )}
        </div>
    );
}

export default EditContact;