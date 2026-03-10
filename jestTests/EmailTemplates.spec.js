/** @jest-environment jsdom */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResetPasswordEmail from '../src/components/EmailTemplates/ResetPasswordEmail';
import NotificationEmail from '../src/components/EmailTemplates/NotificationEmail';

// Mock the image imports which might fail in Jest tests
jest.mock('../src/images/logos/EmailBanner.png', () => 'mocked-banner.png');

describe('Email Template Components', () => {

    describe('ResetPasswordEmail', () => {
        it('renders the username and verification code correctly', () => {
            render(
                <ResetPasswordEmail 
                    username="Alice" 
                    verificationCode="987654" 
                    expiryTime="10 minutes" 
                />
            );

            // Assert greeting contains username
            expect(screen.getByText('Hi Alice,')).toBeInTheDocument();
            
            // Assert verification code is displayed
            expect(screen.getByText('987654')).toBeInTheDocument();
            
            // Assert expiry time is included
            expect(screen.getByText(/Please enter this code in the password reset page within 10 minutes for your security./i)).toBeInTheDocument();
        });

        it('applies dark mode class when isDarkMode is true', () => {
            const { container } = render(
                <ResetPasswordEmail username="Bob" verificationCode="123" expiryTime="5m" isDarkMode={true} />
            );
            
            expect(container.firstChild).toHaveClass('dark-mode');
            expect(container.firstChild).not.toHaveClass('light-mode');
        });

        it('applies light mode class when isDarkMode is false', () => {
            const { container } = render(
                <ResetPasswordEmail username="Bob" verificationCode="123" expiryTime="5m" isDarkMode={false} />
            );
            
            expect(container.firstChild).toHaveClass('light-mode');
            expect(container.firstChild).not.toHaveClass('dark-mode');
        });
    });

    describe('NotificationEmail', () => {
        it('renders the username and notification counts correctly', () => {
            render(
                <NotificationEmail 
                    username="Charlie" 
                    newComments={5} 
                    newLikes={12} 
                />
            );

            // Assert greeting contains username
            expect(screen.getByText('Hi Charlie,')).toBeInTheDocument();
            
            // Assert comment count
            expect(screen.getByText('(5) new comments on your post.')).toBeInTheDocument();
            
            // Assert like count
            expect(screen.getByText('(12) likes on your comment.')).toBeInTheDocument();
        });

        it('renders "like" (singular) when newLikes is 1', () => {
            render(
                <NotificationEmail 
                    username="David" 
                    newComments={0} 
                    newLikes={1} 
                />
            );
            
            expect(screen.getByText('(1) like on your comment.')).toBeInTheDocument();
        });
    });

});
