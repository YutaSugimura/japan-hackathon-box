from boa.interop.System.Storage import GetContext, Get, Put
from boa.interop.System.Runtime import Notify

ctx = GetContext()

def Main(operation, args):
   if operation == 'PutInfoOf':
       account = args[0]
       did = args[1]
       return PutInfoOf(account, did)
   if operation == 'GetInfoOf':
       account = args[0]
       return GetInfoOf(account)
   if operation == 'Request':
       outsider = args[0]
       student = args[1]
       return Request(outsider, student)
   return false


def PutInfoOf(account, did):
   Put(ctx, account, did)
   return True

def GetInfoOf(account):
   return Get(ctx, account)

def Request(outsider, student):
    Notify("Outsider was approved!")
    return True